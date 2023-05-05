import intellexer from "../../intellexer_api.app.mjs";

export default {
  key: "intellexer_api-summarize-text",
  name: "Summarize Text",
  description: "Summarize text using Intellexer API. [See the documentation](http://esapi.intellexer.com/Home/Help)",
  version: "0.0.1",
  type: "action",
  props: {
    intellexer,
    text: {
      type: "string",
      label: "Text",
      description: "The text to summarize",
    },
    loadConceptsTree: {
      type: "boolean",
      label: "Load Concepts Tree",
      description: "Load a tree of concepts. Default: true",
      default: true,
      optional: true,
    },
    loadNamedEntityTree: {
      type: "boolean",
      label: "Load Named Entity Tree",
      description: "Load a tree of Named Entities. Default: true",
      default: true,
      optional: true,
    },
    summaryRestriction: {
      type: "integer",
      label: "Summary Restriction",
      description: "Determine size of a summary measured in sentences",
      optional: true,
    },
    structure: {
      propDefinition: [
        intellexer,
        "structure",
      ],
      optional: true,
    },
    returnedTopicsCount: {
      type: "integer",
      label: "Returned Topics Count",
      description: "Determine max count of text topics to return",
      optional: true,
    },
    fullTextTrees: {
      type: "boolean",
      label: "Full Text Trees",
      description: "Set to true to load full text trees",
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
      loadConceptsTree: this.loadConceptsTree,
      loadNamedEntityTree: this.loadNamedEntityTree,
      summaryRestriction: this.summaryRestruction,
      structure: this.structure,
      returnedTopicsCount: this.returnedTopicsCount,
      fullTextTrees: this.fullTextTrees,
      wrapConcepts: this.wrapConcepts,
    };

    const data = this.text;

    const response = await this.intellexer.summarizeText({
      params,
      data,
      $,
    });

    if (response) {
      $.export("$summary", "Successfully summarized text.");
    }

    return response;
  },
};
