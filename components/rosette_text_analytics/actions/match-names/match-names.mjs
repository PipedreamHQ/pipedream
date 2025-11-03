import app from "../../rosette_text_analytics.app.mjs";

export default {
  key: "rosette_text_analytics-match-names",
  name: "Match Names",
  description: "Compare two names using Rosette. [See the documentation](https://documentation.babelstreet.com/analytics/match-names/name-similarity/match-names)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    nameOne: {
      propDefinition: [
        app,
        "nameOne",
      ],
    },
    nameTwo: {
      propDefinition: [
        app,
        "nameTwo",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.matchName({
      $,
      data: {
        name1: {
          text: this.nameOne,
        },
        name2: {
          text: this.nameTwo,
        },
      },
    });
    $.export("$summary", "Successfully compared names, resulting in a score of " + response.score);
    return response;
  },
};
