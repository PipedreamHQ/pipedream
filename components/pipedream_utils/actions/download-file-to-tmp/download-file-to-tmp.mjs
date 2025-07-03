import pipedream_utils from "../../pipedream_utils.app.mjs";
import { axios } from "@pipedream/platform";
import fs from "fs";

export default {
  key: "pipedream_utils-download-file-to-tmp",
  name: "Helper Functions - Download File To /tmp",
  description: "Downloads a file to [your workflow's /tmp directory](https://pipedream.com/docs/code/nodejs/working-with-files/#the-tmp-directory)",
  version: "0.0.2",
  type: "action",
  props: {
    pipedream_utils,
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
