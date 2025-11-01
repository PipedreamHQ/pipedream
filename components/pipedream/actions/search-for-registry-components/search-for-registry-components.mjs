import app from "../../pipedream.app.mjs";

export default {
  key: "pipedream-search-for-registry-components",
  name: "Search For Registry Components",
  description: "Search for components in the Pipedream global registry using a query string. [See the documentation](https://pipedream.com/docs/rest-api/api-reference/components/search-for-registry-components)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
    idempotentHint: true,
  },
  type: "action",
  props: {
    app,
    query: {
      propDefinition: [
        app,
        "query",
      ],
    },
    appSlug: {
      label: "App Slug",
      description: "The slug of the app to search for components in",
      optional: true,
      propDefinition: [
        app,
        "appId",
        () => ({
          mapper: ({
            name_slug: value,
            name: label,
          }) => ({
            value,
            label,
          }),
        }),
      ],
    },
    similarityThreshold: {
      propDefinition: [
        app,
        "similarityThreshold",
      ],
    },
    debug: {
      propDefinition: [
        app,
        "debug",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      query,
      appSlug,
      similarityThreshold,
      debug,
    } = this;

    const response = await app.searchComponents({
      $,
      params: {
        query,
        app: appSlug,
        similarity_threshold: similarityThreshold,
        debug,
      },
    });

    $.export("$summary", "Successfully searched the global registry for components.");
    return response;
  },
};
