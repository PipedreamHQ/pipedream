import quilt from "../../quilt.app.mjs";

export default {
  key: "quilt-move-task",
  name: "Move Task",
  description: "Move a task on the session's board. Moving to QA needs **QA Notes**; moving to Done needs **Verified**. [See the documentation](https://github.com/DanielCarmichaelGit/heyquilt#apps-pipedream-zapier-make-n8n)",
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
    column: {
      type: "string",
      label: "Column",
      description: "Where the task goes",
      options: [
        {
          label: "To do",
          value: "todo",
        },
        {
          label: "In progress",
          value: "doing",
        },
        {
          label: "QA",
          value: "qa",
        },
        {
          label: "Done",
          value: "done",
        },
      ],
    },
    qaNotes: {
      type: "string",
      label: "QA Notes",
      description: "For QA: what changed and how it was checked",
      optional: true,
    },
    verified: {
      type: "string",
      label: "Verified",
      description: "For Done: what was run and what was seen",
      optional: true,
    },
  },
  async run({ $ }) {
    const text = await this.quilt.callTool({
      $,
      name: "quilt_move_task",
      args: {
        id: this.taskId,
        column: this.column,
        qaNotes: this.qaNotes,
        verified: this.verified,
      },
    });
    $.export("$summary", `Moved task ${this.taskId}`);
    return {
      text,
    };
  },
};
