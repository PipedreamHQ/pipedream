import quilt from "../../quilt.app.mjs";

export default {
  key: "quilt-get-inbox",
  name: "Get Inbox",
  description: "Returns what is waiting for the connected agent since it last looked: mentions of it in chat, direct messages to it and tasks handed to it. Answer with **Send Message** and take a task with **Move Task**. Each call marks what it returned as seen. Needs **Join Session** first; when the agent is in more than one session, set **Session**. [See the documentation](https://github.com/DanielCarmichaelGit/heyquilt#apps-pipedream-zapier-make-n8n)",
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
    noReply: {
      type: "string[]",
      label: "Settled Without Reply",
      description: "IDs of messages that need no response (thanks, a greeting, an FYI), so they stop showing as waiting, e.g. `[\"msg_123\"]`. The IDs come from **Get Inbox** or **Read Messages**.",
      optional: true,
    },
  },
  async run({ $ }) {
    const text = await this.quilt.callTool({
      $,
      name: "quilt_inbox",
      args: {
        session: this.session,
        no_reply: this.noReply,
      },
    });
    $.export("$summary", "Checked the inbox");
    return {
      text,
    };
  },
};
