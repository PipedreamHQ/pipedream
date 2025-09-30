import helper_functions from "../../helper_functions.app.mjs";
import { axios } from "@pipedream/platform";
import fs from "fs";

export default {
  key: "helper_functions-download-file-to-tmp",
  name: "Download File To /tmp",
  description: "Downloads a file to [your workflow's /tmp directory](https://pipedream.com/docs/code/nodejs/working-with-files/#the-tmp-directory)",
  version: "0.3.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    helper_functions,
    url: {
      type: "string",
      label: "Download File URL",
      description: "Enter the URL of the file to download",
    },
    filename: {
      type: "string",
      label: "Target Filename",
      description: "The filename that will be used to save in /tmp",
    },
    syncDir: {
      type: "dir",
      accessMode: "write",
      sync: true,
    },
  },
  async run({ $ }) {
    const {
      url, filename,
    } = this;

    const resp = await axios($, {
      url,
      responseType: "arraybuffer",
    });

    /**
     * Saves file to /tmp folder and exports file's file name and file path,
     */
    const rawcontent = resp.toString("base64");
    const buffer = Buffer.from(rawcontent, "base64");
    const downloadedFilepath = `/tmp/${filename}`;
    fs.writeFileSync(downloadedFilepath, buffer);

    const filedata = [
      filename,
      downloadedFilepath,
    ];

    return filedata;
  },
};
