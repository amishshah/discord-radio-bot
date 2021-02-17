const prism = require('prism-media');

/**
 * Creates an output Ogg Opus stream for the given hardware resource
 * @param {string} hardwareDevice The ID for the hardware device (see `pactl list short sources`)
 * @param {string} type The input type (dshow or pulse)
 */
function createRecorder(hardwareDevice, type) {
  if (type === 'pulse') {
    return new prism.FFmpeg({
      args: [
        '-analyzeduration', '0',
        '-loglevel', '0',
        '-f', 'pulse',
        '-i', hardwareDevice,
        '-acodec', 'libopus',
        '-f', 'opus',
        '-ar', '48000',
        '-ac', '2'
      ],
    });
  } else if (type === 'dshow') {
    return new prism.FFmpeg({
      args: [
        '-f', 'dshow',
        '-i', `audio="${hardwareDevice}"`,
        '-acodec', 'libopus',
        '-f', 'opus',
        '-ar', '48000',
        '-ac', '2'
      ],
    });
  } else {
    throw new Error(`Recorder type '${type}' is invalid`);
  }
}

exports.createRecorder = createRecorder;
