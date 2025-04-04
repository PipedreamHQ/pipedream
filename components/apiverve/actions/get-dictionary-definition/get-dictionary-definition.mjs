import apiverve from "../../apiverve.app.mjs";

export default {
  key: "apiverve-get-dictionary-definition",
  name: "Get Dictionary Definition",
  description: "Get the definition of a word. [See the documentation](https://docs.apiverve.com/api/dictionary)",
  version: "0.0.1",
  type: "action",
  props: {
    apiverve,
    word: {
      type: "string",
      label: "Word",
      description: "The word for which you want to get the definition (e.g., apple)",
    },
  },
  async run({ $ }) {
    const response = await this.apiverve.getDictionaryDefinition({
      $,
      params: {
        word: this.word,
      },
    });
    if (response?.status === "ok") {
      $.export("$summary", `Successfully retrieved definition of ${this.word}`);
    }
    return response;
  },
};
