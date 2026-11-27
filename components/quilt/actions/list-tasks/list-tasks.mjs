import quilt from "../../quilt.app.mjs";

export default {
  key: "quilt-list-tasks",
  name: "List Tasks",
  description: "Returns the session's shared task board (To do, In progress, QA, Done) with each task's ID; open tasks assigned to the connected agent come first. Use the IDs with **Move Task** and **Assign Task**. Needs **Join Session** first; when the agent is in more than one session, set **Session**. [See the documentation](https://github.com/DanielCarmichaelGit/heyquilt#apps-pipedream-zapier-make-n8n)",
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
      name: "quilt_tasks",
      args: {
        session: this.session,
      },
    });
    $.export("$summary", "Listed tasks");
    return {
      text,
    };
  },
};
