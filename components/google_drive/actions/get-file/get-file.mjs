import googleDrive from "../../google_drive.app.mjs";

export default {
  key: "google_drive-get-file",
  name: "Get File",
  description:
    "Get full metadata for a file or folder by its ID."
    + " Returns name, MIME type, size, parent folders, sharing permissions, web links, creation/modification dates, and more."
    + " Use **Search Files** first to find the file ID if you only have the file name."
    + " By default returns all fields. Pass specific field names to `fields` to reduce the response size."
    + "\n\nCommon fields: `id`, `name`, `mimeType`, `size`, `parents`, `webViewLink`, `webContentLink`,"
    + " `createdTime`, `modifiedTime`, `owners`, `permissions`, `description`, `trashed`."
    + " [See the documentation](https://developers.google.com/drive/api/v3/reference/files/get)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    googleDrive,
    fileId: {
      type: "string",
      label: "File ID",
      description:
        "The ID of the file or folder to retrieve."
        + " Use **Search Files** to find the file ID by name.",
    },
    fields: {
      type: "string",
      label: "Fields",
      description:
        "Comma-separated list of fields to include in the response."
        + " Example: `id,name,mimeType,webViewLink,parents,permissions`."
        + " Omit to return all fields.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.googleDrive.getFile(this.fileId, {
      fields: this.fields || "*",
    });

    $.export("$summary", `Retrieved file: ${response.name}`);
    return response;
  },
};
