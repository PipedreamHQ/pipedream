import app from "../../loopmessage.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "loopmessage-typing-indicator",
  name: "Show Typing Indicator",
  description: "Action to present a typing indicator or read status",
  type: "action",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    messageId: {
      propDefinition: [
        app,
        "messageId",
      ],
    },
    typing: {
      propDefinition: [
        app,
        "typing",
      ],
    },
    read: {
      propDefinition: [
        app,
        "read",
      ],
    },
  },
  methods: {
    getSummary() {
      return "Request accepted.";
    },
  },
  async run({ $: step }) {
    const {
      app,
      ...data
    } = this;

    try {
      const response = await app.sendTyping({
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
