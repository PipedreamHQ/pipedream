import app from "../../metabase.app.mjs";

export default {
  key: "metabase-run-query",
  name: "Run Query",
  description: "Execute a saved question/card and return the results. [See the documentation](https://www.metabase.com/docs/latest/api#tag/apicard/post/api/card/{card-id}/query).",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
    dashboardId: {
      propDefinition: [
        app,
        "dashboardId",
      ],
      optional: true,
    },
    collectionPreview: {
      type: "boolean",
      label: "Collection Preview",
      description: "Whether to return the collection preview",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app,
      cardId,
      ignoreCache,
      dashboardId,
      collectionPreview,
    } = this;

    const response = await app.runCardQuery({
      $,
      cardId,
      data: {
        ignore_cache: ignoreCache,
        dashboard_id: dashboardId,
        collection_preview: collectionPreview,
      },
    });

    $.export("$summary", "Successfully executed query");

    return response;
  },
};
