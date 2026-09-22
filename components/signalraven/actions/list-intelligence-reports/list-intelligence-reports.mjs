import app from "../../signalraven.app.mjs";

export default {
  key: "signalraven-list-intelligence-reports",
  name: "List Intelligence Reports",
  description: "List person and account research reports, optionally filtered by type or a name search. [See the documentation](https://signalraven.ai/developers/api)",
  type: "action",
  ai: "optimized",
  version: "0.0.1",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    reportType: {
      type: "string",
      label: "Report Type",
      description: "Restrict to account or person reports.",
      optional: true,
      options: [
        "account",
        "person",
      ],
    },
    query: {
      type: "string",
      label: "Search",
      description: "Match reports by person or company name.",
      optional: true,
    },
    limit: {
      propDefinition: [
        app,
        "limit",
      ],
    },
    offset: {
      propDefinition: [
        app,
        "offset",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.listIntelligence({
      $,
      params: {
        type: this.reportType,
        q: this.query,
        limit: this.limit,
        offset: this.offset,
      },
    });
    const count = response.data?.length || 0;
    $.export("$summary", `Fetched ${count} report${count === 1
      ? ""
      : "s"}.`);
    return response;
  },
};
