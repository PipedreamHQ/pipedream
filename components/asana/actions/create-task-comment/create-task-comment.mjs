import asana from "../../asana.app.mjs";
import common from "../common/common.mjs";

export default {
  key: "asana-create-task-comment",
  name: "Create Task Comment",
  description: "Adds a comment to a task. [See the documentation](https://developers.asana.com/docs/create-a-story-on-a-task)",
  version: "0.2.12",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    task_gid: {
      label: "Task GID",
      description: "The task GID to operate on.",
      type: "string",
      propDefinition: [
        asana,
        "tasks",
        (c) => ({
          project: c.project,
        }),
      ],
    },
    text: {
      label: "Text",
      description: "The plain text of the comment to add. Cannot be used with html_text.",
      type: "string",
      optional: true,
    },
    html_text: {
      label: "HTML Text",
      description: "HTML formatted text for a comment. This will not include the name of the creator.",
      type: "string",
      optional: true,
    },
    is_pinned: {
      label: "Is Pinned",
      description: "Conditional. Whether the story should be pinned on the resource.",
      type: "boolean",
      optional: true,
    },
    sticker_name: {
      label: "Sticker Name",
      description: "The name of the sticker in this story. null if there is no sticker.",
      type: "string",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.asana._makeRequest({
      path: `tasks/${this.task_gid}/stories`,
      method: "post",
      data: {
        data: {
          text: this.text,
          html_text: this.html_text,
          is_pinned: this.is_pinned,
          sticker_name: this.sticker_name,
        },
      },
      $,
    });

    $.export("$summary", "Successfully created task comment");

    return response;
  },
};
