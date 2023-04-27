import intellexer from "../../intellexer_api.app.mjs";

export default {
  key: "intellexer_api-summarize-document",
  name: "Summarize Document",
  description: "Summarize a document using Intellexer API. [See the documentation](http://esapi.intellexer.com/Home/Help)",
  version: "0.0.1",
  type: "action",
  props: {
    intellexer,
    url: {
      type: "string",
      label: "URL",
      description: "URL of the document to summarize",
    },
    loadConceptsTree: {
      type: "boolean",
      label: "Load Concepts Tree",
      description: "Load a tree of concepts. Default: false",
      default: false,
      optional: true,
    },
    loadNamedEntityTree: {
      type: "boolean",
      label: "Load Named Entity Tree",
      description: "Load a tree of Named Entities. Default: false",
      default: false,
      optional: true,
    },
    summaryRestriction: {
      type: "integer",
      label: "Summary Restriction",
      description: "Determine size of a summary measured in sentences",
      optional: true,
    },
    structure: {
      type: "string",
      label: "Structure",
      description: "Specify structure of the document",
      options: [
        "News Article",
        "Research Paper",
        "Patent",
        "General",
      ],
      optional: true,
    },
    returnedTopicsCount: {
      type: "integer",
      label: "Returned Topics Count",
      description: "Determine max count of document topics to return",
      optional: true,
    },
    fullTextTrees: {
      type: "boolean",
      label: "Full Text Trees",
      description: "Set to true to load full text trees",
      optional: true,
    },
    useCache: {
      type: "boolean",
      label: "Use Cache",
      description: "If true, document content will be loaded from cache if there is any",
      optional: true,
    },
    wrapConcepts: {
      type: "boolean",
      label: "Wrap Concepts",
      description: "Mark concepts found in the summary with HTML bold tags. Default: false",
      default: false,
      optional: true,
    },
  },
  async run({ $ }) {
    const params = {
      url: this.url,
      loadConceptsTree: this.loadConceptsTree,
      loadNamedEntityTree: this.loadNamedEntityTree,
      summaryRestriction: this.summaryRestruction,
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
