import sharepoint from "../../sharepoint.app.mjs";
import fs from "fs";

export default {
  key: "sharepoint-download-file",
  name: "Download File",
  description: "Download a Microsoft Sharepoint file to the /tmp directory. [See the documentation](https://learn.microsoft.com/en-us/graph/api/driveitem-get-content?view=graph-rest-1.0&tabs=http)",
  version: "0.0.8",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
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
    },
    filename: {
      type: "string",
      label: "Filename",
      description: "The filename to save the downloaded file as in the `/tmp` directory",
    },
    syncDir: {
      type: "dir",
      accessMode: "write",
      sync: true,
    },
  },
  async run({ $ }) {
    const response = await this.sharepoint.getFile({
      $,
      driveId: this.driveId,
      fileId: this.fileId,
      responseType: "arraybuffer",
    });

    const rawcontent = response.toString("base64");
    const buffer = Buffer.from(rawcontent, "base64");
    const downloadedFilepath = `/tmp/${this.filename}`;
    fs.writeFileSync(downloadedFilepath, buffer);

    return {
      filename: this.filename,
      downloadedFilepath,
    };
  },
};
