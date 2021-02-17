# Discord Radio Bot 🎧

A proof-of-concept radio bot for Discord.js. Streams audio from a hardware device on your computer (e.g. your output speaker, input microphone) over a Discord voice channel.

**Works on:**

- Linux (via PulseAudio `pulse`)
- Windows (via DirectShow `dshow`)

**Only works on systems with Pulse audio!**

## Usage

1. Clone the repo
2. Install dependencies - `npm install`
3. Configure `data/config.json`
	- See below for system-specific details.
4. Start! - `npm start`

## Configuring on Windows via `dshow`

Run `ffmpeg -list_devices true -f dshow -i dummy` and observe output containing something similar:

```
DirectShow audio devices
 "Stereo Mix (Realtek(R) Audio)"
    Alternative name "@device_cm_{ID1}\wave_{ID2}"
```

For example, playing the above device will mirror audio from the speaker output of your machine. Your `config.json` should then be considered like so:

```json
{
  "token": "discord_bot_token",
  "device": "Stereo Mix (Realtek(R) Audio)",
  "type": "dshow",
  "maxTransmissionGap": 5000
}
```

## License

> MIT License
> 
> Copyright (c) 2021 Amish Shah
> 
> Permission is hereby granted, free of charge, to any person obtaining a copy
> of this software and associated documentation files (the "Software"), to deal
> in the Software without restriction, including without limitation the rights
> to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
> copies of the Software, and to permit persons to whom the Software is
> furnished to do so, subject to the following conditions:
> 
> The above copyright notice and this permission notice shall be included in all
> copies or substantial portions of the Software.
> 
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
> IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
> FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
> AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
> LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
> OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
> SOFTWARE.
