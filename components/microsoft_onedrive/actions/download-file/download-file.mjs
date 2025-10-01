import fs from "fs";
import stream from "stream";
import util from "util";
import onedrive from "../../microsoft_onedrive.app.mjs";
import httpRequest from "../../common/httpRequest.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  name: "Download File",
  description: "Download a file stored in OneDrive. [See the documentation](https://learn.microsoft.com/en-us/onedrive/developer/rest-api/api/driveitem_get_content?view=odsp-graph-online)",
  key: "microsoft_onedrive-download-file",
  version: "0.0.9",
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
      optional: true,
    },
    filePath: {
      type: "string",
      label: "File Path",
      description: "The path to the file from the root folder, e.g., `Documents/My Subfolder/File 1.docx`. You can either provide this, or search for an existing file with the `File ID` prop.",
      optional: true,
    },
    newFileName: {
      type: "string",
      label: "New File Name",
      description: "The file name to save the downloaded content as, under the `/tmp` folder. Make sure to include the file extension.",
    },
    syncDir: {
      type: "dir",
      accessMode: "write",
      sync: true,
    },
  },
  methods: {
    httpRequest,
  },
  async run({ $ }) {
    const {
      fileId, filePath, newFileName,
    } = this;

    if (!fileId && !filePath) {
      throw new ConfigurationError("You must specify either **File ID** or **File Path**.");
    }

    const url = fileId
      ? `items/${fileId}/content`
      : `/root:/${encodeURI(filePath)}:/content`;
    let response;
    try {
      response = await this.httpRequest({
        $,
        url,
        responseType: "stream",
      });
    } catch {
      throw new ConfigurationError(`Error accessing file. Please make sure that the ${ fileId
        ? "File ID"
        : "File Path"} is correct.`);
    }

    const fileName = newFileName.split("/").pop();
    const tmpFilePath = `/tmp/${fileName}`;

    const pipeline = util.promisify(stream.pipeline);
    await pipeline(response, fs.createWriteStream(tmpFilePath));

    $.export("$summary", `Returned file contents and saved to \`${tmpFilePath}\`.`);
    return tmpFilePath;
  },
};
