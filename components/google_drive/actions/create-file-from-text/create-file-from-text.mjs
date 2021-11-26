import googleDrive from "../../google_drive.app.mjs";
import { Readable } from "stream";

export default {
  key: "google_drive-create-file-from-text",
  name: "Create New File From Text",
  description: "Create a new file from plain text",
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
    parentId: {
      propDefinition: [
        googleDrive,
        "folderId",
        (c) => ({
          drive: c.drive,
        }),
      ],
      description:
        "The folder you want to add the file to. If not specified, the file will be placed directly in the user's My Drive folder.",
      optional: true,
    },
    name: {
      propDefinition: [
        googleDrive,
        "fileName",
      ],
      description:
        "The name of the file you want to create (e.g., `myFile.txt`)",
    },
    content: {
      type: "string",
      label: "Content",
      description: "Enter text to create the file with.",
      optional: true,
      default: "",
    },
  },
  async run() {
    const {
      parentId,
      name,
      content,
    } = this;
    const file = Readable.from([
      content,
    ]);
    return await this.googleDrive.createFileFromOpts({
      mimeType: "text/plain",
      file,
      name,
      parentId,
    });
  },
};
