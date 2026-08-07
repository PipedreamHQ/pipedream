import app from "../../caesar.app.mjs";

export default {
  key: "caesar-search-web",
  name: "Search Web",
  description: "Search the web with Caesar. [See the documentation](https://docs.trycaesar.com)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    query: {
      propDefinition: [
        app,
        "query",
      ],
    },
    maxResults: {
      propDefinition: [
        app,
        "maxResults",
      ],
    },
    mode: {
      propDefinition: [
        app,
        "mode",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.search({
      query: this.query,
      maxResults: this.maxResults,
      mode: this.mode,
    });
    $.export("$summary", `Found ${response.results?.length ?? 0} result(s) for "${this.query}".`);
    return response;
  },
};
