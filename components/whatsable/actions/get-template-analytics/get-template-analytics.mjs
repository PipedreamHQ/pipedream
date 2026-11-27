import whatsable from "../../whatsable.app.mjs";

export default {
  name: "Get Template Analytics",
  description: "Retrieve template performance analytics from Whatsable",
  key: "whatsable-get-template-analytics",
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
      description: "Filter analytics by Whatsable number ID, e.g. `123456789`.",
      optional: true,
    },
  },

  async run({ $ }) {
    const response = await this.whatsable._makeRequest({
      $,
      method: "GET",
      path: "/analytics/templates",
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

    $.export("$summary", `Retrieved template analytics from ${this.from} to ${this.to}`);

    return response;
  },
};
