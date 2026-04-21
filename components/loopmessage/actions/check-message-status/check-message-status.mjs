import app from "../../loopmessage.app.mjs";

export default {
  key: "loopmessage-check-message-status",
  name: "Check Message Status",
  description: "Action to get the current outbound message status. Possible values: processing, failed, delivered.",
  type: "action",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    messageId: {
      type: "string",
      label: "Message ID",
      description: "Outbound message ID.",
    },
  },
  methods: {
    getSummary(response) {
      return `Message status: ${response.status ?? "unknown"}`;
    },
  },
  async run({ $: step }) {
    try {
      const response = await this.app.getMessageStatus(this.messageId, {
        step,
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
