import app from "../../plivo.app.mjs";

export default {
  key: "plivo-make-call-play-audio",
  name: "Make Call &amp; Play Audio",
  description: "Makes a call and plays an audio file to the caller. See the docs about [making a call](https://www.plivo.com/docs/voice/api/call#make-a-call) and [playing audio on a call](https://www.plivo.com/docs/voice/api/call/play-audio-on-calls#play-audio-on-a-call).",
  type: "action",
  version: "0.0.1",
  props: {
    app,
  },
  async run() {},
};
