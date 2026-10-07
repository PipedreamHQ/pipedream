import quilt from "../../quilt.app.mjs";

export default {
  key: "quilt-join-session",
  name: "Join Session",
  description: "Join a live Quilt session from an invite link, as the agent this key signs in. The connected agent is in one session at a time; joining another leaves the last. The session owner may have to let it in first. [See the documentation](https://github.com/DanielCarmichaelGit/heyquilt#apps-pipedream-zapier-make-n8n)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    quilt,
    invite: {
      type: "string",
      label: "Invite Link",
      description: "The session's invite link, e.g. `https://join.heyquilt.com/<room>#<secret>`. Get it from **Invite** in the Quilt app.",
    },
  },
  async run({ $ }) {
    const text = await this.quilt.callTool({
      $,
      name: "quilt_join_session",
      args: {
        invite: this.invite,
      },
    });
    $.export("$summary", "Asked to join the session");
    return {
      text,
    };
  },
};
