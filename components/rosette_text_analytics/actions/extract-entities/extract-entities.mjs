import app from "../../rosette_text_analytics.app.mjs";

export default {
  key: "rosette_text_analytics-extract-entities",
  name: "Extract Entities",
  description: "Extract entities from content using Rosette. [See the documentation](https://documentation.babelstreet.com/analytics/text-analytics/entity-extractor/extract-entities)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    content: {
      propDefinition: [
        app,
        "content",
      ],
    },
    calculateConfidence: {
      propDefinition: [
        app,
        "calculateConfidence",
      ],
    },
    calculateSalience: {
      propDefinition: [
        app,
        "calculateSalience",
      ],
    },
    includeDBpediaTypes: {
      propDefinition: [
        app,
        "includeDBpediaTypes",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.extractEntities({
      $,
      data: {
        content: this.content,
        options: {
          calculateConfidence: this.calculateConfidence,
          calculateSalience: this.calculateSalience,
          includeDBpediaTypes: this.includeDBpediaTypes,
        },
      },
    });
    $.export("$summary", "Successfully extracted " + response.entities.length + " entities");
    return response;
  },
};
