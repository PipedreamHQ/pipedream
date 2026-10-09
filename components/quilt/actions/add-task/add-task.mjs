import quilt from "../../quilt.app.mjs";

export default {
  key: "quilt-add-task",
  name: "Add Task",
  description: "Adds a task to the session's board, in To do, and returns its ID. Optionally assign it and name the files it is about; change it later with **Assign Task** and **Move Task**. Fails with \"You are not in a session\" until **Join Session** has been run. [See the documentation](https://github.com/DanielCarmichaelGit/heyquilt#apps-pipedream-zapier-make-n8n)",
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
    title: {
      type: "string",
      label: "Title",
      description: "What needs doing, in a few words, e.g. `Fix the login redirect`.",
    },
    assignee: {
      propDefinition: [
        quilt,
        "person",
      ],
      description: "Who should do it: a person's name or `me` for the connected agent, e.g. `Ana`. Leave unset to leave it unassigned. Use **Get Session Status** to list who is in the session.",
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
