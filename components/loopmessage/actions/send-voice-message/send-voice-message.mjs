import app from "../../loopmessage.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "loopmessage-send-voice-message",
  name: "Send Outbound Voice Message",
  description: "Send a voice memo. Supports only in: iMessage, RCS, WhatsApp.",
  type: "action",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    contact: {
      propDefinition: [
        app,
        "contact",
      ],
    },
    sender: {
      optional: true,
      propDefinition: [
        app,
        "sender",
      ],
    },
    mediaUrl: {
      propDefinition: [
        app,
        "mediaUrl",
      ],
    },
    passthrough: {
      optional: true,
      propDefinition: [
        app,
        "passthrough",
      ],
    },
  },
  methods: {
    getSummary(response) {
      return `Request accepted. Message ID: \`${response.message_id}\``;
    },
  },
  async run({ $: step }) {
    const {
      app,
      ...data
    } = this;

    try {
      const response = await app.sendMessage({
        step,
        data: utils.keysToSnakeCase(data),
      });
      step.export("$summary", this.getSummary(response));

      return response;
    } catch (error) {
      if (error.response?.status === 400) {
        const message =
            error.response.data?.message ??
            error.response.data?.error_code ??
            JSON.stringify(error.response.data);

        throw new Error(message);
      }
      throw error;
    }
  },
};
