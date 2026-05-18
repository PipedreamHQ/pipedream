import app from "../../hedy.app.mjs";

export default {
  key: "hedy-get-highlight",
  name: "Get Highlight",
  description: "Retrieves full details for a single AI-generated highlight by ID, including the raw quote, cleaned quote, main idea, and AI insight."
    + " Use **Get Many Highlights** or **Get Highlights By Session** first to find a highlight ID."
    + " [See the documentation](https://www.hedy.ai/help/hedy-api/)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    highlightId: {
      propDefinition: [
        app,
        "highlightId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getHighlight({
      $,
      highlightId: this.highlightId,
    });
    const highlight = response?.data || response;
    $.export("$summary", `Retrieved highlight: ${highlight?.title || this.highlightId}`);
    return response;
  },
};
