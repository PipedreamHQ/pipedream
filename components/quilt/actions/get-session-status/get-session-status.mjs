import quilt from "../../quilt.app.mjs";

export default {
  key: "quilt-get-session-status",
  name: "Get Session Status",
  description: "Returns who is in the session, what they and their AIs are doing, claimed files, recent file changes, recent messages and the task board. Use it before acting, and to find people's names for **Send Message**, **Add Task** and **Assign Task**. Fails with \"You are not in a session\" until **Join Session** has been run. [See the documentation](https://github.com/DanielCarmichaelGit/heyquilt#apps-pipedream-zapier-make-n8n)",
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
      name: "quilt_status",
    });
    $.export("$summary", "Got the session status");
    return {
      text,
    };
  },
};
