import app from "../../hedy.app.mjs";

export default {
  key: "hedy-get-highlights-by-session",
  name: "Get Highlights By Session",
  description: "Retrieves all AI-generated highlights for a specific Hedy session."
    + " Use **Get Many Sessions** first to find the session ID."
    + " Each result includes a highlight ID, title, and timestamp within the session."
    + " Use **Get Highlight** with the highlight ID to fetch the full detail including raw quote, cleaned quote, main idea, and AI insight."
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
    sessionId: {
      propDefinition: [
        app,
        "sessionId",
      ],
    },
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
    const params = {};
    if (this.limit) params.limit = this.limit;
    if (this.after) params.after = this.after;

    const response = await this.app.getHighlightsBySession({
      $,
      sessionId: this.sessionId,
      params,
    });
    const highlights = response?.data || [];
    $.export("$summary", `Retrieved ${highlights.length} highlight${highlights.length === 1
      ? ""
      : "s"} for session ${this.sessionId}`);
    return response;
  },
};
