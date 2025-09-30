import intellexer from "../../intellexer_api.app.mjs";

export default {
  key: "intellexer_api-summarize-document",
  name: "Summarize Document",
  description: "Summarize a document using Intellexer API. [See the documentation](http://esapi.intellexer.com/Home/Help)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    intellexer,
    url: {
      type: "string",
      label: "URL",
      description: "URL of the document to summarize",
    },
    loadConceptsTree: {
      propDefinition: [
        intellexer,
        "loadConceptsTree",
      ],
    },
    loadNamedEntityTree: {
      propDefinition: [
        intellexer,
        "loadNamedEntityTree",
      ],
    },
    summaryRestriction: {
      propDefinition: [
        intellexer,
        "summaryRestriction",
      ],
    },
    structure: {
      propDefinition: [
        intellexer,
        "structure",
      ],
      optional: true,
    },
    returnedTopicsCount: {
      propDefinition: [
        intellexer,
        "returnedTopicsCount",
      ],
    },
    fullTextTrees: {
      propDefinition: [
        intellexer,
        "fullTextTrees",
      ],
    },
    useCache: {
      type: "boolean",
      label: "Use Cache",
      description: "If true, document content will be loaded from cache if there is any",
      optional: true,
    },
    wrapConcepts: {
      propDefinition: [
        intellexer,
        "wrapConcepts",
      ],
    },
  },
  async run({ $ }) {
    const params = {
      url: this.url,
      loadConceptsTree: this.loadConceptsTree,
      loadNamedEntityTree: this.loadNamedEntityTree,
      summaryRestriction: this.summaryRestriction,
      structure: this.structure,
      returnedTopicsCount: this.returnedTopicsCount,
      fullTextTrees: this.fullTextTrees,
      useCache: this.useCache,
      wrapConcepts: this.wrapConcepts,
    };

    const response = await this.intellexer.summarizeDocument({
      params,
      $,
    });

    if (response) {
      $.export("$summary", "Successfully summarized document.");
    }

    return response;
  },
};
