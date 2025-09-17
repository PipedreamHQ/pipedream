import googleDrive from "../../google_drive.app.mjs";

export default {
  key: "google_drive-copy-file",
  name: "Copy File",
  description: "Create a copy of the specified file. [See the documentation](https://developers.google.com/drive/api/v3/reference/files/copy) for more information",
  version: "0.1.13",
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
  async run({ $ }) {
    const resp = await this.googleDrive.copyFile(this.fileId);
    $.export("$summary", `Successfully created a copy of the file, "${resp.name}"`);
    return resp;
  },
};
