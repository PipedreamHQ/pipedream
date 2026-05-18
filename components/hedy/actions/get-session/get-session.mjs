import app from "../../hedy.app.mjs";

export default {
  key: "hedy-get-session",
  name: "Get Session",
  description: "Retrieves full details for a single Hedy meeting session by ID, including the complete transcript, meeting minutes, recap, session notes, highlights array, and action items (todos)."
    + " Use **Get Many Sessions** first to list sessions and obtain a session ID."
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
  },
  async run({ $ }) {
    const response = await this.app.getSession({
      $,
      sessionId: this.sessionId,
    });
    const session = response?.data || response;
    $.export("$summary", `Retrieved session: ${session?.title || this.sessionId}`);
    return response;
  },
};
