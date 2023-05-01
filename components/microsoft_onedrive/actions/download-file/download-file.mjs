import { axios } from "@pipedream/platform";
import fs from "fs";
import onedrive from "../../microsoft_onedrive.app.mjs";

export default {
  name: "Download File",
  description: "Download a file stored in OneDrive [See docs here](https://learn.microsoft.com/en-us/onedrive/developer/rest-api/api/driveitem_get_content?view=odsp-graph-online)",
  key: "microsoft_onedrive-download-file",
  version: "0.0.1",
  type: "action",
  props: {
    onedrive,
    filePath: {
      type: "string",
      label: "File Path",
      description: "The path to the file from the root folder, e.g. `Documents/My Subfolder/File 1.docx`",
    },
    newFileName: {
      type: "string",
      label: "New File Name",
      description: "The file name to save the downloaded content as, under the `/tmp` folder. If not provided, the file will be saved with the same name",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      filePath, newFileName,
    } = this;
    const url = `https://graph.microsoft.com/v1.0/me/drive/root:/${encodeURI(filePath)}:/content`;

    const response = await axios($, {
      url,
      headers: {
        Authorization: `Bearer ${this.onedrive.$auth.oauth_access_token}`,
      },
      responseType: "arraybuffer",
    });

    const fileName = (newFileName ?? filePath).split("/").pop();
    const tmpFilePath = `/tmp/${fileName}`;
    const buffer = Buffer.from(response, "base64");

    fs.writeFileSync(tmpFilePath, buffer);

    $.export("$summary", `Returned file contents and saved to "${tmpFilePath}"`);
    return buffer;
  },
};
