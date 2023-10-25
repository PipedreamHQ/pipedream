import ilovepdf from "../../ilovepdf.app.mjs";
import FormData from "form-data";
import fs from "fs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "ilovepdf-compress-pdf-file",
  name: "Compress PDF File",
  description: "This action reduces the size of a PDF file while maintaining its quality. [See the documentation](https://developer.ilovepdf.com/docs/api-reference)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    ilovepdf,
    fileUrl: {
      propDefinition: [
        ilovepdf,
        "fileUrl",
      ],
    },
    filePath: {
      propDefinition: [
        ilovepdf,
        "filePath",
      ],
    },
  },
  async run({ $ }) {
    const {
      fileUrl, filePath,
    } = this;
    let headers, data = {};
    headers;

    if (filePath) {
      const formData = new FormData();
      // Object.entries(data).forEach(([
      //   key,
      //   value,
      // ]) => {
      //   if (value !== undefined) {
      //     formData.append(key, value);
      //   }
      // });

      const content = fs.createReadStream(filePath.includes("tmp/")
        ? filePath
        : `/tmp/${filePath}`);
      formData.append("file", content);
      headers = {
        "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
      };
      data = formData;
    } else if (fileUrl) {
      data.cloud_file = fileUrl;
      headers = {
        "Content-Type": "application/json",
      };
    } else {
      throw new ConfigurationError("You must provide either a file or a file URL");
    }

    // Start a new task
    const taskResponse = await this.ilovepdf.startTask({
      tool: "compress",
    });
    const task = taskResponse.task;

    // Upload the file
    const uploadResponse = await this.ilovepdf.uploadFile({
      task,
      file: this.file,
    });
    const serverFilename = uploadResponse.server_filename;

    // Process the file
    const processResponse = await this.ilovepdf.processFiles({
      task,
      tool: "compress",
      serverFilename: serverFilename,
    });
    processResponse;

    // Download the processed file
    const downloadResponse = await this.ilovepdf.downloadFiles({
      task,
    });

    $.export("$summary", "Successfully compressed PDF file");
    return downloadResponse;
  },
};
