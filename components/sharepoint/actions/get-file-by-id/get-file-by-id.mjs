import sharepoint from "../../sharepoint.app.mjs";

export default {
  key: "sharepoint-get-file-by-id",
  name: "Get File by ID",
  description: "Retrieves a file by ID. [See the documentation](https://learn.microsoft.com/en-us/onedrive/developer/rest-api/api/driveitem_get)",
  version: "0.0.4",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    sharepoint,
    siteId: {
      propDefinition: [
        sharepoint,
        "siteId",
      ],
    },
    driveId: {
      propDefinition: [
        sharepoint,
        "driveId",
        (c) => ({
          siteId: c.siteId,
        }),
      ],
    },
    fileId: {
      propDefinition: [
        sharepoint,
        "fileId",
        (c) => ({
          siteId: c.siteId,
          driveId: c.driveId,
        }),
      ],
      description: "The file to retrieve. You can either search for the file here or provide a custom *File ID*.",
    },
    select: {
      propDefinition: [
        sharepoint,
        "select",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.sharepoint.getDriveItem({
      $,
      siteId: this.siteId,
      fileId: this.fileId,
      params: {
        select: this.select,
      },
    });
    $.export("$summary", `Successfully retrieved file with ID: ${this.fileId}`);
    return response;
  },
};
