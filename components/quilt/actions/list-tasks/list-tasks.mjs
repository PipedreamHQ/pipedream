import quilt from "../../quilt.app.mjs";

export default {
  key: "quilt-list-tasks",
  name: "List Tasks",
  description: "List the session's shared task board (To do, In progress, QA, Done) with each task's ID. Open tasks assigned to the connected agent come first. [See the documentation](https://github.com/DanielCarmichaelGit/heyquilt#apps-pipedream-zapier-make-n8n)",
  version: "0.0.1",
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
