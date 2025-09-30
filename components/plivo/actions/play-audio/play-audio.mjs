import app from "../../plivo.app.mjs";

export default {
  key: "plivo-play-audio",
  name: "Plays An Audio",
  description: "Plays audio on a call. [See the docs](https://www.plivo.com/docs/voice/api/call/play-audio-on-calls#play-audio-on-a-call).",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    callUuid: {
      propDefinition: [
        app,
        "callUuid",
      ],
    },
    url: {
      type: "string",
      label: "Media URL",
      description: "A URL linking to an `.mp3` or `.wav` file.",
    },
  },
  methods: {
    playAudioOnCall(args = []) {
      return this.app.makeRequest({
        path: "calls.playMusic",
        args,
      });
    },
  },
  async run({ $: step }) {
    const {
      callUuid,
      url,
    } = this;

    const response = await this.playAudioOnCall([
      callUuid,
      url,
    ]);

    step.export("$summary", "Successfully queued played audio on a call");

    return response;
  },
};
