import ilovepdf from "../../ilovepdf.app.mjs";
import FormData from "form-data";
import fs from "fs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "ilovepdf-process-files",
  name: "Process Files",
  description: "Process one or more files with the desired tool. [See the documentation](https://developer.ilovepdf.com/docs/api-reference)",
  version: "0.0.1",
  type: "action",
  props: {
    ilovepdf,
    fileUrls: {
      propDefinition: [
        ilovepdf,
        "fileUrls",
      ],
    },
    filePaths: {
      propDefinition: [
        ilovepdf,
        "filePaths",
      ],
    },
    tool: {
      propDefinition: [
        ilovepdf,
        "tool",
      ],
    },
  },
  async run({ $ }) {
    const {
      fileUrls, filePaths, tool,
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

    if (!filePaths?.length && !fileUrls.length) {
      throw new ConfigurationError("You must provide either a File Path or File URL");
    }

    const fileNames = [
      ...filePaths ?? [],
      ...fileUrls ?? [],
    ].map((f) => f.split("/").pop());

    // Upload the files
    const pathUploads = (filePaths ?? []).map(async (filePath) => {
      const formData = new FormData();
      formData.append("task", task);

      const content = fs.createReadStream(filePath.includes("tmp/")
        ? filePath
        : `/tmp/${filePath}`);
      formData.append("file", content);
      const headers = {
        "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
      };
      return this.ilovepdf.uploadFile({
        $,
        token,
        server,
        data: formData,
        headers,
      });
    });

    const urlUploads = (fileUrls ?? []).map(async (fileUrl) => {
      return this.ilovepdf.uploadFile({
        $,
        token,
        server,
        data: {
          task,
          cloud_file: fileUrl,
        },
        headers: {
          "Content-Type": "application/json",
        },
      });
    });

    const uploadResponses = await Promise.all([
      ...pathUploads,
      ...urlUploads,
    ]);

    const serverFilenames = uploadResponses.map((response) => response?.server_filename);

    // Process the files
    const processResponse = await this.ilovepdf.processFiles({
      $,
      server,
      token,
      data: {
        task,
        tool,
        files: serverFilenames.map((value, index) => (
          {
            server_filename: value,
            filename: fileNames[index],
          }
        )),
      },
    });

    // Download the processed file
    const downloadResponse = await this.ilovepdf.downloadFiles({
      $,
      token,
      server,
      task,
    });

    $.export("$summary", `Successfully processed ${processResponse.output_filenumber} files`);
    return {
      processResponse,
      downloadResponse,
    };
  },
};
