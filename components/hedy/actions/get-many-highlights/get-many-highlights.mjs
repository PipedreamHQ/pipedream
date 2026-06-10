import app from "../../hedy.app.mjs";

export default {
  key: "hedy-get-many-highlights",
  name: "Get Many Highlights",
  description: "Retrieves a paginated list of AI-generated highlights across all Hedy sessions."
    + " Each highlight includes a title, timestamp, and the session it came from."
    + " Use **Get Highlight** with a specific highlight ID to fetch the full detail including raw quote, cleaned quote, main idea, and AI insight."
    + " To list highlights for a specific session only, use **Get Highlights By Session**."
    + " [See the documentation](https://app.swaggerhub.com/apis-docs/HedyAI/hedy-api/1.5.2#/Highlights/get_highlights)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    limit: {
      propDefinition: [
        app,
        "limit",
      ],
    },
    after: {
      propDefinition: [
        app,
        "after",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.listHighlights({
      $,
      params: {
        limit: this.limit,
        after: this.after,
      },
    });
    const highlights = response?.data || [];
    $.export("$summary", `Retrieved ${highlights.length} highlight${highlights.length === 1
      ? ""
      : "s"}`);
    return response;
  },
};
