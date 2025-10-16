import intellexer from "../../intellexer_api.app.mjs";

export default {
  key: "intellexer_api-summarize-text",
  name: "Summarize Text",
  description: "Summarize text using Intellexer API. [See the documentation](http://esapi.intellexer.com/Home/Help)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    intellexer,
    text: {
      type: "string",
      label: "Text",
      description: "The text to summarize",
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
    wrapConcepts: {
      propDefinition: [
        intellexer,
        "wrapConcepts",
      ],
    },
  },
  async run({ $ }) {
    const params = {
      loadConceptsTree: this.loadConceptsTree,
      loadNamedEntityTree: this.loadNamedEntityTree,
      summaryRestriction: this.summaryRestriction,
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
