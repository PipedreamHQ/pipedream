import googleDrive from "../../google_drive.app.mjs";

export default {
  key: "google_drive-copy-file",
  name: "Copy File",
  description: "Create a copy of the specified file",
  version: "0.0.1",
  type: "action",
  props: {
    googleDrive,
    drive: {
      propDefinition: [
        googleDrive,
        "watchedDrive",
      ],
      description:
        "The drive to use. If not specified, your personal Google Drive will be used. If you are connected with any [Google Shared Drives](https://support.google.com/a/users/answer/9310351), you can select it here.",
      optional: true,
    },
    fileId: {
      propDefinition: [
        googleDrive,
        "fileId",
        (c) => ({
          drive: c.drive,
        }),
      ],
      description: "The file to copy",
    },
  },
  async run() {
    return await this.googleDrive.copyFile(this.fileId);
  },
};
