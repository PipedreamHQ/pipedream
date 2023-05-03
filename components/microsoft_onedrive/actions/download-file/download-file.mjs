import fs from "fs";
import onedrive from "../../microsoft_onedrive.app.mjs";
import httpRequest from "../../common/httpRequest.mjs";

export default {
  name: "Download File",
  description: "Download a file stored in OneDrive. [See the documentation](https://learn.microsoft.com/en-us/onedrive/developer/rest-api/api/driveitem_get_content?view=odsp-graph-online)",
  key: "microsoft_onedrive-download-file",
  version: "0.0.1",
  type: "action",
  props: {
    onedrive,
    filePath: {
      type: "string",
      label: "File Path",
      description: "The path to the file from the root folder, e.g., `Documents/My Subfolder/File 1.docx`",
    },
    newFileName: {
      type: "string",
      label: "New File Name",
      description: "The file name to save the downloaded content as, under the `/tmp` folder. If not provided, the file will be saved with the same name.",
      optional: true,
    },
  },
  methods: {
    httpRequest,
  },
  async run({ $ }) {
    const {
      filePath, newFileName,
    } = this;

    const url = `/root:/${encodeURI(filePath)}:/content`;
    const response = await this.httpRequest({
      $,
      url,
      responseType: "arraybuffer",
    });

    const fileName = (newFileName ?? filePath).split("/").pop();
    const tmpFilePath = `/tmp/${fileName}`;
    const buffer = Buffer.from(response, "base64");

    fs.writeFileSync(tmpFilePath, buffer);

    $.export("$summary", `Returned file contents and saved to \`${tmpFilePath}\`.`);
    return buffer;
  },
};
