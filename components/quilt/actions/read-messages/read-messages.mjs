import quilt from "../../quilt.app.mjs";

export default {
  key: "quilt-read-messages",
  name: "Read Messages",
  description: "Read recent chat messages in the session, including direct messages to the connected agent. [See the documentation](https://github.com/DanielCarmichaelGit/heyquilt#apps-pipedream-zapier-make-n8n)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    quilt,
    limit: {
      type: "integer",
      label: "Limit",
      description: "How many of the newest messages (1 to 100, default 20)",
      optional: true,
      min: 1,
      max: 100,
    },
  },
  async run({ $ }) {
    const text = await this.quilt.callTool({
      $,
      name: "quilt_read_messages",
      args: {
        limit: this.limit,
      },
    });
    $.export("$summary", "Read messages");
    return {
      text,
    };
  },
};
