import quilt from "../../quilt.app.mjs";

export default {
  key: "quilt-leave-session",
  name: "Leave Session",
  description: "Leave the Quilt session the connected agent is in. Its file claims are released. [See the documentation](https://github.com/DanielCarmichaelGit/heyquilt#apps-pipedream-zapier-make-n8n)",
  version: "0.0.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    quilt,
  },
  async run({ $ }) {
    const text = await this.quilt.callTool({
      $,
      name: "quilt_leave_session",
    });
    $.export("$summary", "Left the session");
    return {
      text,
    };
  },
};
