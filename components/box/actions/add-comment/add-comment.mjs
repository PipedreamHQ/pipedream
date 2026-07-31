// x-pd-ai: optimized
import { ConfigurationError } from "@pipedream/platform";
import app from "../../box.app.mjs";

export default {
  key: "box-add-comment",
  name: "Add Comment",
  description: "Adds a comment to a Box file. Provide either Message or Tagged Message (with `@` mentions). Use **Get Comments** to read existing comments on a file. [See the documentation](https://developer.box.com/reference/post-comments/).",
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
      description: "The parent folder of the file to comment on. Use `0` for the root folder.",
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
      description: "The file to add a comment to (e.g. `123456789`)",
    },
    message: {
      type: "string",
      label: "Message",
      description: "The text of the comment",
      optional: true,
    },
    taggedMessage: {
      type: "string",
      label: "Tagged Message",
      description: "The text of the comment with mentions in the format `@[user_id:name]` (e.g. `@[1234:John] Review completed!`). Use this instead of Message when mentioning another user.",
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.message && !this.taggedMessage) {
      throw new ConfigurationError("Either Message or Tagged Message is required.");
    }

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
