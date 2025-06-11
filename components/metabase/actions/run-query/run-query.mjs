import app from "../../metabase.app.mjs";

export default {
  key: "metabase-run-query",
  name: "Run Query",
  description: "Execute a saved question/card and return the results. [See the documentation](https://www.metabase.com/docs/latest/api#tag/apicard/post/api/card/pivot/{card-id}/query).",
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
    ignoreCache: {
      type: "boolean",
      label: "Ignore Cache",
      description: "Whether to ignore the cache and run the query again",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app,
      cardId,
      ignoreCache,
    } = this;

    const response = await app.runCardQuery({
      $,
      cardId,
      data: {
        ignore_cache: ignoreCache,
      },
    });

    $.export("$summary", "Successfully executed query");

    return response;
  },
};
