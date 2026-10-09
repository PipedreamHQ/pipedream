import quilt from "../../quilt.app.mjs";

export default {
  key: "quilt-move-task",
  name: "Move Task",
  description: "Moves a task to another column of the session's board. Moving to QA needs **QA Notes** and moving to Done needs **Verified**, or Quilt refuses the move. Moving to In progress returns a briefing on the task's files and recent changes. Fails with \"You are not in a session\" until **Join Session** has been run. [See the documentation](https://github.com/DanielCarmichaelGit/heyquilt#apps-pipedream-zapier-make-n8n)",
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
    column: {
      type: "string",
      label: "Column",
      description: "The column to move the task to, e.g. `doing`: `todo`, `doing` (In progress), `qa` or `done`.",
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
      description: "Required when moving to `qa`: what changed and how it was checked, e.g. `Fixed the redirect; signed in and out in Chrome and Safari`.",
      optional: true,
    },
    verified: {
      type: "string",
      label: "Verified",
      description: "Required when moving to `done`: what was run and what was seen, e.g. `npm test: 120 passed; signed in on staging`.",
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
    $.export("$summary", `Moved task ${this.taskId} to ${this.column}`);
    return {
      text,
    };
  },
};
