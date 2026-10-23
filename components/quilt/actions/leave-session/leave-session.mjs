import quilt from "../../quilt.app.mjs";

export default {
  key: "quilt-leave-session",
  name: "Leave Session",
  description: "Leaves one Quilt session and releases the agent's file claims there. Its other sessions and its webhook stay, and the session and its files are untouched; run **Join Session** again to come back. [See the documentation](https://github.com/DanielCarmichaelGit/heyquilt#apps-pipedream-zapier-make-n8n)",
  version: "0.0.1",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    quilt,
    session: {
      propDefinition: [
        quilt,
        "session",
      ],
    },
  },
  async run({ $ }) {
    const text = await this.quilt.callTool({
      $,
      name: "quilt_leave_session",
      args: {
        session: this.session,
      },
    });
    $.export("$summary", "Left the session");
    return {
      text,
    };
  },
};
