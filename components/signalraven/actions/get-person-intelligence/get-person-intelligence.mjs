import app from "../../signalraven.app.mjs";

export default {
  key: "signalraven-get-person-intelligence",
  name: "Get Person Intelligence",
  description: "Fetch a person research report: who they are, what they engaged with, the ICP read, and talking points. [See the documentation](https://signalraven.ai/developers/api)",
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
    reportId: {
      propDefinition: [
        app,
        "reportId",
        () => ({
          reportType: "person",
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getPersonIntelligence({
      $,
      reportId: this.reportId,
    });
    $.export("$summary", `Fetched person report ${this.reportId}.`);
    return response;
  },
};
