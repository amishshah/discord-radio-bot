const prism = require('prism-media');

/**
 * Creates an output Ogg Opus stream for the given hardware resource
 * @param {string} hardwareDevice The ID for the hardware device (see `pactl list short sources`)
 */
function createRecorder(hardwareDevice) {
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
	})
}

exports.createRecorder = createRecorder;
