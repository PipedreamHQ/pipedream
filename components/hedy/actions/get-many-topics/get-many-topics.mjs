import app from "../../hedy.app.mjs";

export default {
  key: "hedy-get-many-topics",
  name: "Get Many Topics",
  description: "Retrieves all Hedy meeting topics with their session counts, last session date, dominant session type, and cached AI overview."
    + " Use this tool to browse available topics or to find a topic ID to pass to **Get Topic**, **Get Topic Sessions**, **Update Topic**, or **Delete Topic**."
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
  },
  async run({ $ }) {
    const response = await this.app.listTopics({
      $,
    });
    const topics = response?.data || [];
    $.export("$summary", `Retrieved ${topics.length} topic${topics.length === 1
      ? ""
      : "s"}`);
    return response;
  },
};
