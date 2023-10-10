import ilovepdf from "../../ilovepdf.app.mjs";

export default {
  key: "ilovepdf-convert-files-to-pdf",
  name: "Convert Files to PDF",
  description: "This component converts uploaded files into PDF format using the iLovePDF API. [See the documentation](https://developer.ilovepdf.com/docs/api-reference)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    ilovepdf,
    task: {
      propDefinition: [
        ilovepdf,
        "task",
      ],
    },
    file: {
      propDefinition: [
        ilovepdf,
        "file",
      ],
    },
    tool: {
      propDefinition: [
        ilovepdf,
        "tool",
        (c) => ({
          tool: "officepdf",
        }),  // set the tool to "officepdf" to convert files to PDF
      ],
    },
    serverFilename: {
      propDefinition: [
        ilovepdf,
        "serverFilename",
      ],
    },
  },
  async run({ $ }) {
    // Start the task
    const taskResponse = await this.ilovepdf.startTask({
      tool: this.tool,
    });

    // Upload the file
    const uploadResponse = await this.ilovepdf.uploadFile({
      task: this.task,
      file: this.file,
    });

    // Process the files
    const processResponse = await this.ilovepdf.processFiles({
      task: this.task,
      tool: this.tool,
      serverFilename: this.serverFilename,
    });

    // Download the files
    const downloadResponse = await this.ilovepdf.downloadFiles({
      task: this.task,
    });

    $.export("$summary", "Successfully converted files to PDF");
    return downloadResponse;
  },
};
