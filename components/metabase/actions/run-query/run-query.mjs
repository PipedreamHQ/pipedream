import app from "../../metabase.app.mjs";

export default {
  key: "metabase-run-query",
  name: "Run Query",
  description: "Execute a saved question/card and return the results. [See the documentation](https://www.metabase.com/docs/latest/api#tag/apicard/POST/api/card/{card-id}/query).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    cardId: {
      propDefinition: [
        app,
        "cardId",
      ],
    },
    parameters: {
      type: "object",
      label: "Parameters",
      description: "Parameters to pass to the query (if the question has parameters)",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      cardId, parameters,
    } = this;

    const response = await this.app.runCardQuery({
      $,
      cardId,
      data: parameters || {},
    });

    $.export("$summary", `Successfully executed query for card ${cardId}`);

    return response;
  },
};
