import constants from "../../common/constants.mjs";
import app from "../../loopmessage.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "loopmessage-send-reaction",
  name: "Send Reaction",
  description: "Action to send a reaction in iMessage or RCS.",
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
    messageId: {
      type: "string",
      label: "Message ID",
      description: "The ID of the message to react to. You can get it from the webhook trigger.",
    },
    reaction: {
      type: "string",
      label: "Reaction",
      description: "Reactions that starts with `-` mean remove it from the message.",
      options: constants.REACTIONS,
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
      const response = await app.sendReaction({
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
