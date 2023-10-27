import ilovepdf from "../../ilovepdf.app.mjs";
import FormData from "form-data";
import fs from "fs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "ilovepdf-compress-pdf-file",
  name: "Compress PDF File",
  description: "This action reduces the size of a PDF file while maintaining its quality. [See the documentation](https://developer.ilovepdf.com/docs/api-reference)",
  version: "0.0.1",
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
    const tool = "compress";
    const {
      fileUrl, filePath,
    } = this;

    const { token } = await this.ilovepdf.getAuthToken({
      $,
    });

    // Start a new task
    const {
      server, task,
    } = await this.ilovepdf.startTask({
      $,
      token,
      tool,
    });

    let headers, data = {
      task,
    };

    if (filePath) {
      const formData = new FormData();
      formData.append("task", task);

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

    // Upload the file
    const { server_filename: serverFilename } = await this.ilovepdf.uploadFile({
      $,
      token,
      server,
      data,
      headers,
    });

    // Process the file
    const fileName = (filePath ?? fileUrl).split("/").pop();
    const processResponse = await this.ilovepdf.processFiles({
      $,
      server,
      token,
      data: {
        task,
        tool,
        files: [
          {
            server_filename: serverFilename,
            filename: fileName,
          },
        ],
      },
    });

    // Download the processed file
    const downloadResponse = await this.ilovepdf.downloadFiles({
      $,
      token,
      server,
      task,
    });

    $.export("$summary", "Successfully compressed PDF file");
    return {
      processResponse,
      downloadResponse,
    };
  },
};
