import googleDrive from "../../google_drive.app.mjs";

export default {
  key: "google_drive-delete-comment",
  name: "Delete Comment",
  description: "Delete a specific comment (Requires ownership or permissions). [See the documentation](https://developers.google.com/workspace/drive/api/reference/rest/v3/comments/delete)",
  version: "0.0.2",
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
      description: "The file containing the comment to delete.",
    },
    commentId: {
      propDefinition: [
        googleDrive,
        "commentId",
        (c) => ({
          fileId: c.fileId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.googleDrive.deleteComment(
      this.commentId,
      this.fileId,
    );

    $.export("$summary", `Successfully deleted comment ${this.commentId} from file ${this.fileId}`);
    return response.data;
  },
};
