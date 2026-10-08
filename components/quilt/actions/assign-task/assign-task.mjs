import quilt from "../../quilt.app.mjs";

export default {
  key: "quilt-assign-task",
  name: "Assign Task",
  description: "Assigns a task on the session's board to a person or their AI, or unassigns it, and optionally replaces the files it is about. Find the task with **List Tasks**. Fails with \"You are not in a session\" until **Join Session** has been run. [See the documentation](https://github.com/DanielCarmichaelGit/heyquilt#apps-pipedream-zapier-make-n8n)",
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
    taskId: {
      propDefinition: [
        quilt,
        "taskId",
      ],
    },
    assignee: {
      propDefinition: [
        quilt,
        "person",
      ],
      description: "Who should do it: a person's name or `me` for the connected agent, e.g. `Ana`. Leave unset to unassign the task. Use **Get Session Status** to list who is in the session.",
      optional: true,
    },
    toAi: {
      propDefinition: [
        quilt,
        "toAi",
      ],
    },
    files: {
      propDefinition: [
        quilt,
        "files",
      ],
      description: "Replaces the task's files, as paths relative to the project folder, e.g. `[\"src/app.js\"]`. Leave unset to keep its files.",
    },
  },
  async run({ $ }) {
    const text = await this.quilt.callTool({
      $,
      name: "quilt_assign_task",
      args: {
        id: this.taskId,
        assignee: this.assignee ?? "",
        to_ai: this.toAi,
        files: this.files,
      },
    });
    $.export("$summary", `${this.assignee
      ? "Assigned"
      : "Unassigned"} task ${this.taskId}`);
    return {
      text,
    };
  },
};
