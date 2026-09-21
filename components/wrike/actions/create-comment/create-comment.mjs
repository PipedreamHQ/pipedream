import wrike from "../../wrike.app.mjs";

export default {
  key: "wrike-create-comment",
  name: "Create Comment",
  description: "Post a comment on a Wrike task via POST /tasks/{taskId}/comments. Use **Find Tasks** or **Get Task** to obtain the taskId. [See the documentation](https://developers.wrike.com/reference/posttaskssinglecomments)",
  version: "0.0.2",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    wrike,
    taskId: {
      propDefinition: [
        wrike,
        "taskId",
      ],
      description: "The ID of the task to comment on, e.g. `IEAASDF3KQAAAAAA`. Run **Find Tasks** to look up task IDs.",
    },
    text: {
      type: "string",
      label: "Text",
      description: "The comment text. Cannot be empty. Supports HTML unless plainText is true.",
    },
    plainText: {
      type: "boolean",
      label: "Plain Text",
      description: "Set true to treat the text as plain text rather than HTML. Defaults to false.",
      optional: true,
    },
  },
  async run({ $ }) {
    const comment = await this.wrike.createComment({
      $,
      taskId: this.taskId,
      data: {
        text: this.text,
        plainText: this.plainText,
      },
    });

    $.export("$summary", `Successfully created comment (${comment.id}) on task ${this.taskId}`);
    return comment;
  },
};
