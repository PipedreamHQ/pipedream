import quilt from "../../quilt.app.mjs";

export default {
  key: "quilt-read-messages",
  name: "Read Messages",
  description: "Returns the session's recent chat messages, including direct messages to the connected agent, oldest first, each with its ID. Fails with \"You are not in a session\" until **Join Session** has been run. [See the documentation](https://github.com/DanielCarmichaelGit/heyquilt#apps-pipedream-zapier-make-n8n)",
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
    limit: {
      type: "integer",
      label: "Limit",
      description: "How many of the newest messages to return, from 1 to 100, e.g. `50`. Defaults to 20.",
      optional: true,
      min: 1,
      max: 100,
      default: 20,
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
