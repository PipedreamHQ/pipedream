import quilt from "../../quilt.app.mjs";

export default {
  key: "quilt-assign-task",
  name: "Assign Task",
  description: "Assign a task on the session's board to a person or their AI, and optionally replace the files it is about. [See the documentation](https://github.com/DanielCarmichaelGit/heyquilt#apps-pipedream-zapier-make-n8n)",
  version: "0.0.1",
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
      description: "A person's name, `me` for the connected agent, or leave empty to unassign",
    },
    toAi: {
      type: "boolean",
      label: "Assign to Their AI",
      description: "Assign it to that person's AI instead of the person",
      optional: true,
    },
    files: {
      propDefinition: [
        quilt,
        "files",
      ],
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
    $.export("$summary", `Assigned task ${this.taskId}`);
    return {
      text,
    };
  },
};
