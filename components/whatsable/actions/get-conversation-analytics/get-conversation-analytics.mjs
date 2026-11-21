import whatsable from "../../whatsable.app.mjs";

export default {
  name: "Get Conversation Analytics",
  description: "Retrieve conversation analytics from Whatsable",
  key: "whatsable-get-conversation-analytics",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },

  props: {
    whatsable,
    from: {
      type: "string",
      label: "Start Date",
      description: "Start date in YYYY-MM-DD format",
    },
    to: {
      type: "string",
      label: "End Date",
      description: "End date in YYYY-MM-DD format",
    },
    time_zone: {
      type: "string",
      label: "Timezone",
      description: "IANA timezone, e.g. Asia/Dhaka",
      default: "Asia/Dhaka",
      optional: true,
    },
    number_id: {
      type: "string",
      label: "Number ID",
      description: "Whatsable phone number ID to filter analytics for.",
      optional: true,
    },
  },

  async run({ $ }) {
    const response = await this.whatsable._makeRequest({
      $,
      method: "GET",
      path: "/analytics/conversations",
      params: {
        from: this.from,
        to: this.to,
        time_zone: this.time_zone,
        ...(this.number_id
          ? {
            number_id: this.number_id,
          }
          : {}),
      },
    });

    $.export("$summary", `Retrieved conversation analytics from ${this.from} to ${this.to}`);

    return response;
  },
};
