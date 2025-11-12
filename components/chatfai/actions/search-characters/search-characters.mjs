import app from "../../chatfai.app.mjs";

export default {
  key: "chatfai-search-characters",
  name: "Search Public Characters",
  description: "Search for public characters on ChatFAI. [See the documentation](https://chatfai.com/developers/docs#tag/characters/paths/~1characters~1search/get)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    searchQuery: {
      propDefinition: [
        app,
        "searchQuery",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.searchCharacters({
      $,
      params: {
        q: this.searchQuery,
      },
    });
    $.export("$summary", `Successfully searched for public characters with query: ${this.searchQuery}`);
    return response;
  },
};
