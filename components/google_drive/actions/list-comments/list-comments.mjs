import googleDrive from "../../google_drive.app.mjs";

export default {
  key: "google_drive-list-comments",
  name: "List Comments",
  description: "List all comments on a file. [See the documentation](https://developers.google.com/workspace/drive/api/reference/rest/v3/comments/list)",
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
      description: "The file to list comments for.",
    },
  },
  async run({ $ }) {
    const response = await this.googleDrive.listSyncComments(
      this.driveId,
      this.fileId,
    );

    $.export("$summary", `Successfully found ${response.data.comments.length} comment(s) for file ${this.fileId}`);
    return response.data.comments;
  },
};
