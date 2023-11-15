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
    extraParameters: {
      type: "object",
      label: "Extra Parameters",
      description: "Any extra parameters to be passed. Values will be parsed as JSON when applicable. [Refer to the documentation for the extra parameters of each tool](https://developer.ilovepdf.com/docs/api-reference#Process).",
      optional: true,
    },
    outputFilename: {
      type: "string",
      label: "Output Filename",
      description: "If specified, the name of the file that will be written to the `/tmp` folder. Defaults to the download filename returned by the API.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      fileUrls, filePaths, tool, extraParameters, outputFilename,
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
        ...Object.fromEntries(Object.entries(extraParameters ?? {}).map(([
          key,
          value,
        ]) => {
          try {
            return [
              key,
              JSON.parse(value),
            ];
          } catch (e) {
            return [
              key,
              value,
            ];
          }
        })),
      },
    });

    // Download the processed file
    const downloadResponse = await this.ilovepdf.downloadFiles({
      $,
      token,
      server,
      task,
      responseType: "arraybuffer",
    });

    const filePath = outputFilename?.includes?.("tmp/")
      ? outputFilename
      : `/tmp/${outputFilename ?? processResponse.download_filename}`;

    await fs.promises.writeFile(filePath, Buffer.from(downloadResponse));

    $.export("$summary", `Successfully processed ${processResponse.output_filenumber} files`);
    return {
      processResponse,
      downloadResponse,
      filePath,
    };
  },
};
