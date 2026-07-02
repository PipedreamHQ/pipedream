import app from "../../eppo.app.mjs";

export default {
  key: "eppo-get-feature-flag",
  name: "Get Feature Flag",
  description:
    "Retrieve full details for a single feature flag including its allocation rules, assignment configuration, and variations."
    + " Use this tool when the user asks about a specific flag's configuration or assignment logic."
    + " Use **List Feature Flags** first to find the numeric `flagId` — Eppo uses integer IDs, not string keys, for flag lookups."
    + " [See the documentation](https://eppo.cloud/api/docs#/FeatureFlags/getFeatureFlag)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    flagId: {
      propDefinition: [
        app,
        "flagId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getFeatureFlag({
      $,
      flagId: this.flagId,
    });
    $.export("$summary", `Retrieved feature flag ${this.flagId}: ${response?.name ?? response?.key ?? ""}`);
    return response;
  },
};
