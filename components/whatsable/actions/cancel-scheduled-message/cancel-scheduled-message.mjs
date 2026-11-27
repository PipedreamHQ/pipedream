import whatsable from "../../whatsable.app.mjs";

export default {
  name: "Cancel Scheduled Message",
  description: "Cancel a scheduled Whatsable message",
  key: "whatsable-cancel-scheduled-message",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },

  props: {
    whatsable,
    scheduled_message_id: {
      type: "string",
      label: "Scheduled Message ID",
      description: "ID of the scheduled message to cancel",
    },
  },

  async run({ $ }) {
    const response = await this.whatsable._makeRequest({
      $,
      method: "POST",
      path: `/scheduled-messages/${this.scheduled_message_id}/cancel`,
    });

    $.export("$summary", `Cancelled scheduled message ${this.scheduled_message_id}`);

    return response;
  },
};
