import chatfai from "../../chatfai.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "chatfai-search-characters",
  name: "Search Public Characters",
  description: "Search for public characters on ChatFAI. [See the documentation](https://chatfai.com/developers/docs#tag/characters/paths/~1characters~1search/get)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    chatfai,
    searchQuery: {
      propDefinition: [
        chatfai,
        "searchQuery",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.chaftai.searchPublicCharacters({
      searchQuery: this.searchQuery,
    });

    $.export("$summary", `Successfully searched for public characters with query: ${this.searchQuery}`);
    return response;
  },
};
