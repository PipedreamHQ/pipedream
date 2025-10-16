import { Readable } from "stream";
import googleDrive from "../../google_drive.app.mjs";

export default {
  key: "google_drive-create-file-from-text",
  name: "Create New File From Text",
  description: "Create a new file from plain text. [See the documentation](https://developers.google.com/drive/api/v3/reference/files/create) for more information",
  version: "0.2.7",
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
        "The folder you want to add the file to. If not specified, the file will be placed directly in the drive's top-level folder.",
      optional: true,
    },
    name: {
      propDefinition: [
        googleDrive,
        "fileName",
      ],
      label: "File Name",
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
    mimeType: {
      type: "string",
      label: "Conversion Format",
      description:
        "The [format](https://developers.google.com/drive/api/v3/ref-export-formats) in which the text is presented",
      optional: true,
      default: "text/plain",
      options: [
        {
          value: "text/plain",
          label: "Plain Text",
        },
        {
          value: "text/markdown",
          label: "Markdown",
        },
        {
          value: "text/html",
          label: "HTML",
        },
        {
          value: "application/rtf",
          label: "Rich Text",
        },
        {
          value: "text/csv",
          label: "CSV",
        },
      ],
    },
  },
  async run({ $ }) {
    const {
      parentId,
      name,
      content,
      mimeType,
    } = this;
    const file = Readable.from([
      content,
    ]);
    const drive = this.googleDrive.drive();
    const driveId = this.googleDrive.getDriveId(this.drive);
    const parent = parentId ?? driveId;

    const { data: resp } = await drive.files.create({
      supportsAllDrives: true,
      media: {
        mimeType,
        body: file,
      },
      requestBody: {
        name,
        mimeType: "application/vnd.google-apps.document",
        parents: [
          parent,
        ],
      },
    });

    $.export("$summary", `Successfully created a new file, "${resp.name}"`);
    return resp;
  },
};
