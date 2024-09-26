import googleCloudVision from "../../google_cloud_vision_api.app.mjs";
import { ConfigurationError } from "@pipedream/platform";
import { axios } from "@pipedream/platform";
import fs from "fs";

export default {
  props: {
    googleCloudVision,
    projectId: {
      propDefinition: [
        googleCloudVision,
        "projectId",
      ],
    },
    fileUrl: {
      type: "string",
      label: "File URL",
      description: "The URL of the file to be processed.",
      optional: true,
    },
    filePath: {
      type: "string",
      label: "File Path",
      description: "The path to file in the `/tmp` directory. [See the documentation on working with files](https://pipedream.com/docs/code/nodejs/working-with-files/#writing-a-file-to-tmp).",
      optional: true,
    },
  },
  methods: {
    checkFileProp() {
      if (!this.fileUrl && !this.filePath) {
        throw new ConfigurationError("One of File URL or File Path must be provided.");
      }
    },
    async getFileContent($) {
      const content = this.filePath
        ? await this.getFileFromPath()
        : await this.getFileFromUrl($);
      return Buffer.from(content).toString("base64");
    },
    getFileFromPath() {
      const path = this.filePath.includes("tmp/")
        ? this.filePath
        : `/tmp/${this.filePath}`;
      return fs.readFileSync(path);
    },
    getFileFromUrl($) {
      return axios($, {
        url: this.fileUrl,
        responseType: "arraybuffer",
      });
    },
  },
};
