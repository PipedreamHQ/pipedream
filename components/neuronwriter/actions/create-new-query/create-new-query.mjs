import {
  ENGINE_OPTIONS, LANGUAGE_OPTIONS,
} from "../../common/constants.mjs";
import neuronwriter from "../../neuronwriter.app.mjs";

export default {
  key: "neuronwriter-create-new-query",
  name: "Create New Query",
  description: "Launches a new query based on provided keyword, search engine, and language. [See the documentation](https://contadu.crisp.help/en/article/neuronwriter-api-how-to-use-2ds6hx/#3-new-query)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    neuronwriter,
    keyword: {
      type: "string",
      label: "Keyword",
      description: "The keyword to generate a query and recommendations for.",
    },
    searchEngine: {
      type: "string",
      label: "Search Engine",
      description: "Preferred search engine.",
      options: ENGINE_OPTIONS,
    },
    language: {
      type: "string",
      label: "Language",
      description: "Content language.",
      options: LANGUAGE_OPTIONS,
    },
  },
  async run({ $ }) {
    const response = await this.neuronwriter.createNewQuery({
      $,
      data: {
        project: this.neuronwriter.$auth.project_id,
        keyword: this.keyword,
        engine: this.searchEngine,
        language: this.language,
      },
    });

    $.export("$summary", `Successfully created new query with Id: ${response.query}`);
    return response;
  },
};
