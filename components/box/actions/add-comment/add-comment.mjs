// x-pd-ai: optimized
import app from "../../box.app.mjs";

const MENTION_REGEX = /@\[\d+:[^\]]+\]/;

export default {
  key: "box-add-comment",
  name: "Add Comment",
  description: "Adds a comment to a Box file. To mention a user, include `@[user_id:name]` in the message and Box will notify them by email. Use **Get Comments** to read existing comments on a file. [See the documentation](https://developer.box.com/reference/post-comments/).",
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
      description: "The parent folder of the file to comment on. Use `0` for the root folder. Use the **List Folders** action to retrieve folder IDs.",
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
      description: "The file to add a comment to (e.g. `123456789`). Use the **List Folder Items** action to retrieve file IDs.",
    },
    message: {
      type: "string",
      label: "Message",
      description: "The text of the comment. To mention a user, include `@[user_id:name]` in the text (e.g. `@[1234:John] Review completed!`) and Box will send them an email notification.",
    },
  },
  async run({ $ }) {
    const data = {
      item: {
        type: "file",
        id: this.fileId,
      },
    };

    if (MENTION_REGEX.test(this.message)) {
      data.tagged_message = this.message;
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
