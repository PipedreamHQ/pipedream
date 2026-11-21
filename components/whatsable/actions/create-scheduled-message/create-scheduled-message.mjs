import whatsable from "../../whatsable.app.mjs";

export default {
  name: "Create Scheduled Message",
  description: "Schedule a Whatsable message for future delivery",
  key: "whatsable-create-scheduled-message",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },

  props: {
    whatsable,
    to: {
      type: "string",
      label: "Recipient",
      description: "Recipient phone number in international format",
    },
    message: {
      type: "string",
      label: "Message",
      description: "Message content",
    },
    scheduled_at: {
      type: "string",
      label: "Scheduled Time",
      description: "ISO 8601 date/time for message delivery",
    },
  },

  async run({ $ }) {
    const response = await this.whatsable._makeRequest({
      $,
      method: "POST",
      path: "/scheduled-messages",
      data: {
        to: this.to,
        message: this.message,
        scheduled_at: this.scheduled_at,
      },
    });

    $.export("$summary", `Scheduled message for ${this.to}`);

    return response;
  },
};
