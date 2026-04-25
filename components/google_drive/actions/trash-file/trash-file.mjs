import googleDrive from "../../google_drive.app.mjs";

export default {
  key: "google_drive-trash-file",
  name: "Trash File",
  description:
    "Move a file or folder to the trash in Google Drive."
    + " This is a reversible operation — the file can be restored from trash within 30 days."
    + " Use **Search Files** first to find the file ID by name."
    + " Use this instead of permanent deletion as the safer default."
    + " To find trashed files, use **Search Files** with `trashed = true`."
    + " [See the documentation](https://developers.google.com/drive/api/v3/reference/files/update)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    googleDrive,
    fileId: {
      type: "string",
      label: "File ID",
      description:
        "The ID of the file or folder to move to trash."
        + " Use **Search Files** to find the file ID by name.",
    },
  },
  async run({ $ }) {
    const resp = await this.googleDrive.updateFile(this.fileId, {
      requestBody: {
        trashed: true,
      },
      fields: "*",
    });

    $.export("$summary", `Moved to trash: ${resp.name} (${resp.id})`);
    return resp;
  },
};
