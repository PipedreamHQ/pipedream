import app from "../../rosette_text_analytics.app.mjs";

export default {
  key: "rosette_text_analytics-translate-name",
  name: "Translate Name",
  description: "Translate name using Rosette. [See the documentation](https://documentation.babelstreet.com/analytics/match-names/name-translation/translate-names)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    name: {
      propDefinition: [
        app,
        "name",
      ],
    },
    targetLanguage: {
      propDefinition: [
        app,
        "targetLanguage",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.translateName({
      $,
      data: {
        name: this.name,
        targetLanguage: this.targetLanguage,
      },
    });
    $.export("$summary", "Successfully translated name with " + response.confidence + " confidence");
    return response;
  },
};
