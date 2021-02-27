const { Client, Intents } = require('discord.js');
const { NoSubscriberBehavior, StreamType, createAudioPlayer, createAudioResource, entersState, AudioPlayerStatus, VoiceConnectionStatus, joinVoiceChannel } = require('@discordjs/voice');
const { createRecorder } = require('./Recorder');
const { watch } = require('fs');
const { readFile, utimes, writeFile } = require('fs/promises');
const config = require('../data/config.json');

const player = createAudioPlayer({
  behaviors: {
    noSubscriber: NoSubscriberBehavior.Play,
    maxMissedFrames: Math.round(config.maxTransmissionGap / 20)
  }
});

player.on('stateChange', (oldState, newState) => {
  if (oldState.status === AudioPlayerStatus.Idle && newState.status === AudioPlayerStatus.Playing) {
    console.log('Playing audio output on audio player');
  } else if (newState.status === AudioPlayerStatus.Idle) {
    console.log('Playback has stopped. Attempting to restart.');
    setTimeout(() => attachRecorder(), 3e3);
  }
});

async function attachRecorder() {
  const resource = createAudioResource(createRecorder(config.device, config.type), {
    inputType: StreamType.OggOpus,
  });
  player.play(resource);
}

async function connectToChannel(channel) {
  const connection = joinVoiceChannel(channel);
  try {
    await entersState(connection, VoiceConnectionStatus.Ready, 30e3);
    return connection;
  } catch (error) {
    connection.destroy();
    throw error;
  }
}

const client = new Client({
  ws: { intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] },
});

void client.login(config.token);

client.on('ready', async () => {
  console.log('Discord.js client is ready!');
  if (config.activity != null) {
    const time = new Date();
    try {
      await utimes(config.activity.input, time, time);
    } catch (ex) {
      writeFile(config.activity.input, '{}');
    }
  }

  try {
    await attachRecorder();
    console.log('Song is ready to play!');
  } catch (error) {
    console.error(error);
  }
});

client.on('message', async (message) => {
  if (!message.guild) return;
  if (config.owner != null && message.member.user.id !== config.owner) return;
  if (message.content === `${config.prefix}join`) {
    const channel = message.member?.voice.channel;
    if (channel) {
      try {
        const connection = await connectToChannel(channel);
        connection.subscribe(player);
        await message.reply('Playing now!');
      } catch (error) {
        console.error(error);
      }
    } else {
      void message.reply('Join a voice channel then try again!');
    }
  }
});

if (config.activity != null) {
  let prevActivity = '';
  watch(config.activity.input, async (event) => {
    if (event !== 'change') return;

    let buf;
    try {
      buf = await readFile(config.activity.input);
    } catch (error) {
      console.error(`Could not read activity input '${config.activity.input}'.`);
      console.error(error);
      return;
    }

    let data;
    try {
      data = JSON.parse(buf);
    } catch (err) {
      return;
    }

    const activity = config.activity.format.replace(/\$(\w+)/g, (m, key) => data[key]);
    if (activity === prevActivity) {
      return;
    }

    prevActivity = activity;
    console.log(`Listening to: ${activity}`);
    await client.user.setActivity(activity);
  });
}
