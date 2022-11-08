import helper_functions from "../../helper_functions.app.mjs";
import { axios } from "@pipedream/platform";
import fs from "fs";
import streamifier from "streamifier";

export default {
  key: "helper_functions-download-file-to-tmp",
  name: "Download File To Tmp",
  description: "Downloads a file to workflow /tmp folder",
  version: "0.2.3",
  type: "action",
  props: {
    helper_functions,
    url: {
      type: "string",
      label: "Download File URL",
    },
    filename: {
      type: "string",
      label: "Target Filename",
      description: "The filename that will be used to save in /tmp",
    },
  },
  async run({ $ }) {
    const {
      url,
      filename,
    } = this;

    const resp = await axios($, {
      url,
      responseType: "arraybuffer",
    });

    /**
     * Saves file to /tmp folder and exports file's:
     *
     * filename,
     * complete file path,
     * content in base64 format,
     * buffer,
     * buffer's length,
     * and filestream.
     */
    const rawcontent = resp.toString("base64");
    const buffer = Buffer.from(rawcontent, "base64");
    const downloadedFilepath = `/tmp/${filename}`;
    fs.writeFileSync(downloadedFilepath, buffer);
    const filestream = streamifier.createReadStream(buffer);

    const filedata = [
      filename,
      downloadedFilepath,
      rawcontent,
      buffer,
      Buffer.byteLength(buffer),
      filestream,
    ];

    $.export("filedata", filedata);
    return filedata;
  },
};
