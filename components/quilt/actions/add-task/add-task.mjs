import quilt from "../../quilt.app.mjs";

export default {
  key: "quilt-add-task",
  name: "Add Task",
  description: "Add a task to the session's board, in To do. Optionally assign it and name the files it is about. [See the documentation](https://github.com/DanielCarmichaelGit/heyquilt#apps-pipedream-zapier-make-n8n)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    quilt,
    title: {
      type: "string",
      label: "Title",
      description: "What needs doing, in a few words",
    },
    assignee: {
      propDefinition: [
        quilt,
        "person",
      ],
      optional: true,
      description: "Who should do it: a person's name, or `me` for the connected agent. Leave empty to leave it unassigned.",
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
      name: "quilt_add_task",
      args: {
        title: this.title,
        assignee: this.assignee,
        to_ai: this.toAi,
        files: this.files,
      },
    });
    $.export("$summary", `Added task "${this.title}"`);
    return {
      text,
    };
  },
};
