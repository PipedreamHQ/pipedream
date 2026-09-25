import contentRabbitApp from "../../contentrabbit.app.mjs";

export default {
  key: "contentrabbit-list-activity",
  name: "List Activity",
  description: "Retrieve recent team activity events. [See the documentation](https://contentrabbitai.com/docs/api)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    contentRabbitApp,
    start: {
      type: "string",
      label: "Start Date",
      description: "ISO 8601 start of the range. Defaults to 14 days before end date.",
      optional: true,
    },
    end: {
      type: "string",
      label: "End Date",
      description: "ISO 8601 end of the range. Defaults to now.",
      optional: true,
    },
    timezone: {
      type: "string",
      label: "Timezone",
      description: "IANA timezone (e.g. `America/New_York`). Defaults to team timezone.",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Number of events per page (1-200).",
      default: 50,
      min: 1,
      max: 200,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.contentRabbitApp.listActivity({
      $,
      params: {
        start: this.start,
        end: this.end,
        timezone: this.timezone,
        limit: this.limit,
      },
    });
    $.export("$summary", `Retrieved ${response.data?.items?.length ?? 0} activity events`);
    return response;
  },
};
