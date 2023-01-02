import app from "../../plivo.app.mjs";

export default {
  key: "plivo-make-call-speak-text",
  name: "Make Call &amp; Speak Text",
  description: "Makes a call and speaks a text to the caller. See the docs about [making a call](https://www.plivo.com/docs/voice/api/call#make-a-call) and [speak text on a call](https://www.plivo.com/docs/voice/api/call/speak-text-on-calls#speak-text-on-a-call).",
  type: "action",
  version: "0.0.1",
  props: {
    app,
  },
  async run() {},
};
