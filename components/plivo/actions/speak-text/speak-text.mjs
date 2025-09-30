import app from "../../plivo.app.mjs";

export default {
  key: "plivo-speak-text",
  name: "Speak Text",
  description: "Speaks a text to the caller. [See the docs](https://www.plivo.com/docs/voice/api/call/speak-text-on-calls#speak-text-on-a-call).",
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
    text: {
      propDefinition: [
        app,
        "text",
      ],
      description: "The text that needs to be spoken.",
    },
  },
  methods: {
    speakText(args = []) {
      return this.app.makeRequest({
        path: "calls.speakText",
        args,
      });
    },
  },
  async run({ $: step }) {
    const {
      callUuid,
      text,
    } = this;

    const response = await this.speakText([
      callUuid,
      text,
    ]);

    step.export("$summary", "Successfully queued call and spoke text");

    return response;
  },
};
