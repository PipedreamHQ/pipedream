import { Readable } from "stream";
import googleDrive from "../../google_drive.app.mjs";

export default {
  key: "google_drive-create-text-file",
  name: "Create Text File",
  description:
    "Create a new Google Doc from text content in Google Drive."
    + " The file is created as a Google Docs document, which can be viewed and edited in the browser."
    + " Use this when the user asks to create a document, write a file, or save text to Drive."
    + " To place the file in a specific folder, pass the `parentId` — use **Search Files** with"
    + " `mimeType = 'application/vnd.google-apps.folder'` to find the folder ID first."
    + " Supported content formats: plain text, Markdown, HTML, Rich Text, CSV."
    + " [See the documentation](https://developers.google.com/drive/api/v3/reference/files/create)",
  version: "0.0.{{ts}}",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    googleDrive,
    name: {
      type: "string",
      label: "File Name",
      description: "The name of the new file (e.g., 'Meeting Notes', 'Project Plan').",
    },
    content: {
      type: "string",
      label: "Content",
      description: "The text content of the file.",
      optional: true,
      default: "",
    },
    mimeType: {
      type: "string",
      label: "Content Format",
      description:
        "The format of the content being provided. Defaults to plain text.",
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
    parentId: {
      type: "string",
      label: "Parent Folder ID",
      description:
        "The ID of the folder to create the file in."
        + " Use **Search Files** with `mimeType = 'application/vnd.google-apps.folder'` to find folder IDs."
        + " Omit to create in the root of My Drive.",
      optional: true,
    },
  },
  async run({ $ }) {
    const file = Readable.from([
      this.content,
    ]);
    const drive = this.googleDrive.drive();

    const { data: resp } = await drive.files.create({
      supportsAllDrives: true,
      media: {
        mimeType: this.mimeType,
        body: file,
      },
      requestBody: {
        name: this.name,
        mimeType: "application/vnd.google-apps.document",
        parents: this.parentId
          ? [
            this.parentId,
          ]
          : undefined,
      },
    });

    $.export("$summary", `Created file: ${resp.name} (${resp.id})`);
    return resp;
  },
};
// v1776808904
// pub1776810225
