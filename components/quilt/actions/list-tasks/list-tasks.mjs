import quilt from "../../quilt.app.mjs";

export default {
  key: "quilt-list-tasks",
  name: "List Tasks",
  description: "Returns the session's shared task board (To do, In progress, QA, Done) with each task's ID; open tasks assigned to the connected agent come first. Use the IDs with **Move Task** and **Assign Task**. Fails with \"You are not in a session\" until **Join Session** has been run. [See the documentation](https://github.com/DanielCarmichaelGit/heyquilt#apps-pipedream-zapier-make-n8n)",
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
      name: "quilt_tasks",
    });
    $.export("$summary", "Listed tasks");
    return {
      text,
    };
  },
};
