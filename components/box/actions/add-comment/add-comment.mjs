import app from "../../box.app.mjs";

export default {
  key: "box-add-comment",
  name: "Add Comment",
  description: "Adds a comment to a file. [See the documentation](https://developer.box.com/reference/post-comments/).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    folderId: {
      propDefinition: [
        app,
        "parentId",
      ],
      label: "Parent Folder",
      description: "Use this option to select your File ID from a dropdown list.",
    },
    fileId: {
      propDefinition: [
        app,
        "fileId",
        (c) => ({
          folderId: c.folderId,
        }),
      ],
      label: "File",
      description: "The file to add a comment to",
    },
    message: {
      type: "string",
      label: "Message",
      description: "The text of the comment",
    },
    taggedMessage: {
      type: "string",
      label: "Tagged Message",
      description: "The text of the comment with `@` mentions. Use this instead of Message when mentioning another user.",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      item: {
        type: "file",
        id: this.fileId,
      },
    };

    if (this.taggedMessage) {
      data.tagged_message = this.taggedMessage;
    } else {
      data.message = this.message;
    }

    const response = await this.app.createComment({
      $,
      data,
    });

    $.export("$summary", `Successfully added comment with ID ${response.id}`);
    return response;
  },
};
