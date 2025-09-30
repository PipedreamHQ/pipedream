import { axios } from "@pipedream/platform";
import fs from "fs";
import stream from "stream";
import { promisify } from "util";
import pexels from "../../pexels.app.mjs";

export default {
  key: "pexels-download-photo",
  name: "Download Photo",
  description: "Download a specific photo by providing its photo ID and optionally choosing the desired size. [See the documentation](https://www.pexels.com/api/documentation/)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    pexels,
    photoId: {
      propDefinition: [
        pexels,
        "photoId",
      ],
    },
    filePath: {
      type: "string",
      label: "File Path",
      description: "The destination path in [`/tmp`](https://pipedream.com/docs/workflows/steps/code/nodejs/working-with-files/#the-tmp-directory) for the downloaded the file (e.g., `/tmp/myFile.jpg`). Make sure to include the file extension.",
    },
    syncDir: {
      type: "dir",
      accessMode: "write",
      sync: true,
    },
  },
  methods: {
    getFileStream({
      $, downloadUrl,
    }) {
      return axios($, {
        url: downloadUrl,
        responseType: "stream",
      });
    },
  },
  async run({ $ }) {
    const response = await this.pexels.getPhoto({
      $,
      photoId: this.photoId,
    });

    const fileStream = await this.getFileStream({
      $,
      downloadUrl: response.src.original,
    });

    const pipeline = promisify(stream.pipeline);
    const destinationPath = this.filePath.includes("/tmp")
      ? this.filePath
      : `/tmp/${this.filePath}`;
    const resp = await pipeline(
      fileStream,
      fs.createWriteStream(destinationPath),
    );

    $.export("$summary", `Successfully downloaded photo with ID ${this.photoId} to ${destinationPath}`);
    return {
      resp,
      filePath: destinationPath,
    };
  },
};
