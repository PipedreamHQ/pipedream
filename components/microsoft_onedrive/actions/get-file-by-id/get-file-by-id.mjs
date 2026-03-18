import onedrive from "../../microsoft_onedrive.app.mjs";

export default {
  key: "microsoft_onedrive-get-file-by-id",
  name: "Get File by ID",
  description: "Retrieves a file by ID. [See the documentation](https://learn.microsoft.com/en-us/onedrive/developer/rest-api/api/driveitem_get)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    onedrive,
    fileId: {
      propDefinition: [
        onedrive,
        "fileId",
      ],
      description: "The file to retrieve. You can either search for the file here, provide a custom *File ID*.",
    },
  },
  async run({ $ }) {
    const response = await this.onedrive.client().api(`/me/drive/items/${this.fileId}`)
      .get();
    $.export("$summary", `Successfully retrieved file with ID: ${this.fileId}`);
    return response;
  },
};
