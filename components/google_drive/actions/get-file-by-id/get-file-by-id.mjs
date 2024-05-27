import googleDrive from "../../google_drive.app.mjs";

export default {
  key: "google_drive-get-file-by-id",
  name: "Get File By ID",
  description: "Get info on a specific file. [See the documentation](https://developers.google.com/drive/api/reference/rest/v3/files/get) for more information",
  version: "0.1.8",
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
    fields: {
      type: "string[]",
      label: "Fields",
      description: "Select which fields to obtain for the file. [See the documentation](https://developers.google.com/drive/api/reference/rest/v3/files) for more information",
      optional: true,
    },
  },
  async run({ $ }) {
    $;
  },
};
