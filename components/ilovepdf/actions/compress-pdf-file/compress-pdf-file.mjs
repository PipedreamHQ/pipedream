import ilovepdf from "../../ilovepdf.app.mjs";

export default {
  key: "ilovepdf-compress-pdf-file",
  name: "Compress PDF File",
  description: "This action reduces the size of a PDF file while maintaining its quality. [See the documentation](https://developer.ilovepdf.com/docs/api-reference)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    ilovepdf,
    file: {
      propDefinition: [
        ilovepdf,
        "file",
      ],
    },
  },
  async run({ $ }) {
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

    // Download the processed file
    const downloadResponse = await this.ilovepdf.downloadFiles({
      task,
    });

    $.export("$summary", "Successfully compressed PDF file");
    return downloadResponse;
  },
};
