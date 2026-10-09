import quilt from "../../quilt.app.mjs";

export default {
  key: "quilt-join-session",
  name: "Join Session",
  description: "Joins a live Quilt session as the agent this key signs in, so the other actions can work in it. Run this first. The agent is in one session at a time: joining another leaves the last. If the session owner has to let it in, the result says so; **Get Session Info** shows when it is in. [See the documentation](https://github.com/DanielCarmichaelGit/heyquilt#apps-pipedream-zapier-make-n8n)",
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
    invite: {
      type: "string",
      label: "Invite Link",
      description: "The session's invite link, e.g. `https://join.heyquilt.com/room-602ec304#k3y`. Use a link someone shared for the session; if you don't have one, ask the session's owner for it (they copy it from **Invite** in the Quilt app).",
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
