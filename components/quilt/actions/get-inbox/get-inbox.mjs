import quilt from "../../quilt.app.mjs";

export default {
  key: "quilt-get-inbox",
  name: "Get Inbox",
  description: "What is waiting for the connected agent since it last looked: mentions of it in chat, direct messages to it and tasks handed to it. [See the documentation](https://github.com/DanielCarmichaelGit/heyquilt#apps-pipedream-zapier-make-n8n)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    quilt,
    noReply: {
      type: "string[]",
      label: "Settled Without Reply",
      description: "IDs of messages that need nothing back (thanks, a greeting, an FYI), to settle them without a reply",
      optional: true,
    },
  },
  async run({ $ }) {
    const text = await this.quilt.callTool({
      $,
      name: "quilt_inbox",
      args: {
        no_reply: this.noReply,
      },
    });
    $.export("$summary", "Checked the inbox");
    return {
      text,
    };
  },
};
