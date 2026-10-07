import quilt from "../../quilt.app.mjs";

export default {
  key: "quilt-get-session-info",
  name: "Get Session Info",
  description: "Which Quilt session the connected agent is in, and its access there (waiting for the owner, editor or viewer). [See the documentation](https://github.com/DanielCarmichaelGit/heyquilt#apps-pipedream-zapier-make-n8n)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    quilt,
  },
  async run({ $ }) {
    const text = await this.quilt.callTool({
      $,
      name: "quilt_session_info",
    });
    $.export("$summary", "Got session info");
    return {
      text,
    };
  },
};
