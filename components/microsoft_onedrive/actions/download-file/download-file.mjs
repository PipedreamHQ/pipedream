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
  version: "0.0.5",
  type: "action",
  props: {
    onedrive,
    fileId: {
      type: "string",
      label: "File ID",
      description: "The file to download. You can either search for the file here, provide a custom *File ID*, or use the `File Path` prop to specify the path directly.",
      optional: true,
      useQuery: true,
      async options(context) {
        const { query } = context;
        if (!query) return [];
        const response = await this.httpRequest({
          $: context,
          url: `/search(q='${query}')?select=folder,name,id`,
        });
        return response.value
          .filter(({ folder }) => !folder)
          .map(({
            name, id,
          }) => ({
            label: name,
            value: id,
          }));
      },
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
      description: "The file name to save the downloaded content as, under the `/tmp` folder.",
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
    const response = await this.httpRequest({
      $,
      url,
      responseType: "stream",
    });

    const fileName = newFileName.split("/").pop();
    const tmpFilePath = `/tmp/${fileName}`;

    const pipeline = util.promisify(stream.pipeline);
    await pipeline(response, fs.createWriteStream(tmpFilePath));

    $.export("$summary", `Returned file contents and saved to \`${tmpFilePath}\`.`);
    return tmpFilePath;
  },
};
