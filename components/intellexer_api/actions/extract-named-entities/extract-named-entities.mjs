import intellexer from "../../intellexer_api.app.mjs";

export default {
  key: "intellexer_api-extract-named-entities",
  name: "Extract Named Entities",
  description: "Extract named entities from a document using Intellexer API. [See the documentation](http://esapi.intellexer.com/Home/Help)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    intellexer,
    url: {
      type: "string",
      label: "URL",
      description: "URL of the document to summarize",
    },
    loadNamedEntities: {
      type: "boolean",
      label: "Load Named Entities",
      description: "Load named entities. Default: true",
      default: true,
      optional: true,
    },
    loadRelationsTree: {
      type: "boolean",
      label: "Load Relations Tree",
      description: "Load a tree of Relations. Default: false",
      default: false,
      optional: true,
    },
    loadSentences: {
      type: "boolean",
      label: "Load Sentences",
      description: "Load source sentences. Default: false",
      default: false,
      optional: true,
    },
  },
  async run({ $ }) {
    const params = {
      url: this.url,
      loadNamedEntities: this.loadNamedEntities,
      loadRelationsTree: this.loadRelationsTree,
      loadSentences: this.loadSentences,
    };

    const response = await this.intellexer.extractNamedEntities({
      params,
      $,
    });

    if (response) {
      $.export("$summary", "Successfully extracted named entities.");
    }

    return response;
  },
};
