import googleDrive from "../../google_drive.app.mjs";

export default {
  key: "google_drive-list-replies",
  name: "List Replies",
  description: "List replies to a specific comment. [See the documentation](https://developers.google.com/workspace/drive/api/reference/rest/v3/replies/list) for more information",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    googleDrive,
    drive: {
      propDefinition: [
        googleDrive,
        "watchedDrive",
      ],
      optional: true,
    },
    fileIdTip: {
      type: "alert",
      alertType: "info",
      content: "You can use actions such as **Find File** or **List Files** to obtain a file ID, and use its value here.",
    },
    fileId: {
      propDefinition: [
        googleDrive,
        "fileId",
        (c) => ({
          drive: c.drive,
        }),
      ],
      description: "The file to obtain info for. You can select a file or use a file ID from a previous step.",
    },
    commentId: {
      propDefinition: [
        googleDrive,
        "commentId",
        (c) => ({
          fileId: c.fileId,
        }),
      ],
      description: "The comment to get info for. You can select a comment or use a comment ID from a previous step.",
    },
    includeDeleted: {
      type: "boolean",
      label: "Include Deleted",
      description: "Whether to include deleted replies.",
      optional: true,
    },
  },
  async run({ $ }) {
    const allReplies = [];
    let pageToken;
    do {
      const {
        replies, nextPageToken,
      } = await this.googleDrive.listReplies(pageToken, {
        fileId: this.fileId,
        commentId: this.commentId,
        includeDeleted: this.includeDeleted,
      });

      allReplies.push(...replies);
      pageToken = nextPageToken;
    } while (pageToken);

    $.export("$summary", "Successfully listed replies");
    return allReplies;
  },
};
