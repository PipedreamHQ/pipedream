import app from "../../needle.app.mjs";

export default {
  key: "needle-search-collection",
  name: "Search Collection",
  description: "Search a collection for relevant data chunks based on a query. [See the documentation](https://docs.needle-ai.com/docs/api-reference/search-collection/).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    collectionId: {
      propDefinition: [
        app,
        "collectionId",
      ],
    },
    text: {
      type: "string",
      label: "Search Query",
      description: "The text to search for in the collection.",
    },
    maxDistance: {
      type: "string",
      label: "Maximum Similarity Distance",
      description: "Maximum similarity distance for the search results, between `0` and `1`. Eg. `0.65`.",
      optional: true,
    },
    topK: {
      type: "integer",
      label: "Maximum Number Of Results",
      description: "The maximum number of search results to return.",
      optional: true,
    },
  },
  methods: {
    searchCollection({
      collectionId, ...args
    } = {}) {
      return this.app.post({
        subdomain: "search.",
        path: `/collections/${collectionId}/search`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      searchCollection,
      collectionId,
      text,
      maxDistance,
      topK,
    } = this;

    const response = await searchCollection({
      $,
      collectionId,
      data: {
        text,
        max_distance: maxDistance,
        top_k: topK,
      },
    });

    $.export("$summary", "Successfully searched the collection.");

    return response;
  },
};
