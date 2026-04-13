import app from "../../loopmessage.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "loopmessage-send-text-message",
  name: "Send Outbound Message",
  description: "Action to send a message to an individual recipient.",
  type: "action",
  version: "0.0.4",
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
    text: {
      propDefinition: [
        app,
        "text",
      ],
    },
    subject: {
      propDefinition: [
        app,
        "subject",
      ],
    },
    effect: {
      propDefinition: [
        app,
        "effect",
      ],
    },
    sender: {
      optional: true,
      propDefinition: [
        app,
        "sender",
      ],
    },
    attachments: {
      type: "string[]",
      label: "Attachments",
      description: "Optional. An array of strings. The string must be a full URL of your image. URL should start with https://. HTTP links (without SSL) are not supported. This must be a publicly accessible file URL: we will not be able to reach any URLs that are hidden or that require authentication.",
      optional: true,
    },
    replyToId: {
      optional: true,
      propDefinition: [
        app,
        "replyToId",
      ],
    },
    channel: {
      optional: true,
      propDefinition: [
        app,
        "channel",
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
