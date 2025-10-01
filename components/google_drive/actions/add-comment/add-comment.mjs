import googleDrive from "../../google_drive.app.mjs";

export default {
  key: "google_drive-add-comment",
  name: "Add Comment",
  description: "Add an unanchored comment to a Google Doc (general feedback, no text highlighting). [See the documentation](https://developers.google.com/workspace/drive/api/reference/rest/v3/comments/create)",
  version: "0.0.3",
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
  },
  async run({ $ }) {
    const response = await this.googleDrive.createComment(
      this.content,
      this.fileId,
    );

    $.export("$summary", `Successfully added comment with ID ${response.data.id}`);
    return response.data;
  },
};
