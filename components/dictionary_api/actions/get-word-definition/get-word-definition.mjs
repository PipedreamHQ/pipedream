import dictionaryApi from "../../dictionary_api.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  name: "Get Word Definition",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  key: "dictionary_api-get-word-definition",
  description: "Get the definition for an English word. [See docs here](https://dictionaryapi.dev/)",
  props: {
    dictionaryApi,
    word: {
      type: "string",
      label: "Word",
      description: "Word to define",
    },
  },
  type: "action",
  methods: {},
  async run({ $ }) {
    return await axios($, {
      url: `https://api.dictionaryapi.dev/api/v2/entries/en/${this.word}`,
    });
  },
};
