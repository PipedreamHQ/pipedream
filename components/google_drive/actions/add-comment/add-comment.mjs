import googleDrive from "../../google_drive.app.mjs";

export default {
  key: "google_drive-add-comment",
  name: "Add Comment",
  description: "Add an unanchored comment to a Google Doc (general feedback, no text highlighting). [See the documentation](https://developers.google.com/workspace/drive/api/reference/rest/v3/comments/create)",
  version: "0.1.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    googleDrive,
    drive: {
      propDefinition: [
        googleDrive,
        "watchedDrive",
      ],
      optional: false,
    },
    fileId: {
      propDefinition: [
        googleDrive,
        "fileId",
        (c) => ({
          drive: c.drive,
        }),
      ],
      description: "The file to add a comment to.",
    },
    content: {
      type: "string",
      label: "Comment Content",
      description: "The text content of the comment to add",
    },
    anchor: {
      type: "string",
      label: "Anchor",
      description: "A region of the document represented as a JSON string. For details on defining anchor properties, refer to [Manage comments and replies](https://developers.google.com/workspace/drive/api/v3/manage-comments).",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.googleDrive.createComment(
      this.fileId,
      {
        content: this.content,
        anchor: this.anchor,
      },
    );

    $.export("$summary", `Successfully added comment with ID ${response.data.id}`);
    return response.data;
  },
};
