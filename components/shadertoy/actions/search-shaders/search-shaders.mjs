import app from "../../shadertoy.app.mjs";

export default {
  key: "shadertoy-search-shaders",
  name: "Search Shaders",
  description: "Returns an array of shader IDs based on the query string. [See the documentation](https://www.shadertoy.com/howto)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    query: {
      propDefinition: [
        app,
        "query",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.searchShaders({
      $,
      query: this.query,
    });

    $.export("$summary", `Found ${response.Results.length} shaders matching the query "${this.query}"`);

    return response;
  },
};
