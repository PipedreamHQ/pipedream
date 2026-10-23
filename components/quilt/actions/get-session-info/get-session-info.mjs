import quilt from "../../quilt.app.mjs";

export default {
  key: "quilt-get-session-info",
  name: "Get Session Info",
  description: "Returns the Quilt sessions the connected agent is in, with each session's ID and the agent's access there: waiting for the owner, editor or viewer. Use it after **Join Session** to check the agent was let in, and to find the ID for **Session** in the other actions. [See the documentation](https://github.com/DanielCarmichaelGit/heyquilt#apps-pipedream-zapier-make-n8n)",
  version: "0.0.1",
  ai: "optimized",
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
