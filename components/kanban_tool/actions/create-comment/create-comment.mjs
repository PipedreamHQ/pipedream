import app from "../../kanban_tool.app.mjs";

export default {
  key: "kanban_tool-create-comment",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  name: "Create Comment",
  description: "Creates a comment [See the docs here](https://kanbantool.com/developer/api-v3#creating-comments)",
  props: {
    app,
    boardId: {
      propDefinition: [
        app,
        "boardId",
      ],
    },
    taskId: {
      propDefinition: [
        app,
        "taskId",
        (configuredProps) => ({
          boardId: configuredProps.boardId,
        }),
      ],
    },
    content: {
      type: "string",
      label: "Content",
      description: "Comment's message. Markdown formatting is supported.",
    },
    recipients: {
      type: "string[]",
      label: "Recipients",
      description: "Comment's recipients, if any - e.g.: `['Foo Bar <123>', 'Asdf Asdf <312>']`.",
      optional: true,
    },
  },
  async run ({ $ }) {
    const resp = await this.app.createComment({
      $,
      taskId: this.taskId,
      data: {
        content: this.content,
        recipients: this.recipients,
      },
    });
    $.export("$summary", `The comment(ID: ${resp.id}) has been created successfully.`);
    return resp;
  },
};
