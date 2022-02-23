// legacy_hash_id: a_67ilqM
import streamifier from "streamifier";
import fs from "fs";
import axios from "axios";
import helper_functions from "../../helper_functions.app.mjs";

export default {
  key: "helper_functions-download-file-to-tmp",
  name: "Download File To Tmp",
  description: "Downloads a file to workflow /tmp folder",
  version: "0.2.1",
  type: "action",
  props: {
    helper_functions,
    download_file_uri: {
      type: "string",
    },
    target_download_filename: {
      type: "string",
      description: "File name to download",
    },
  },
  async run({ $ }) {
    const config = {
      method: "GET",
      url: `${this.download_file_uri}`,
      responseType: "arraybuffer",
    };

    const resp = await axios(config);

    //Saves file to /tmp folder and exports file raw content, content in base64 format, buffer,  buffer's lengt, and filestream for use in later steps
    const rawcontent = resp.data.toString("base64");
    const buffer = Buffer.from(rawcontent, "base64");
    const downloadedFilepath = `/tmp/${this.target_download_filename}`;
    fs.writeFileSync(downloadedFilepath, buffer);
    const filestream = streamifier.createReadStream(buffer);
    $.export(
      "filedata",
      [
        this.target_download_filename,
        downloadedFilepath,
        rawcontent,
        buffer,
        Buffer.byteLength(buffer),
        filestream,
      ],
    );
  },
};
