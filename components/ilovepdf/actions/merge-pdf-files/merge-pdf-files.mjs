import ilovepdf from "../../ilovepdf.app.mjs";

export default {
  key: "ilovepdf-merge-pdf-files",
  name: "Merge PDF Files",
  description: "Combines multiple pdf files into one unified document. [See the documentation](https://developer.ilovepdf.com/docs/api-reference#introduction)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    ilovepdf,
    files: {
      type: "string[]",
      label: "Files",
      description: "The files to be processed",
    },
  },
  async run({ $ }) {
    const task = await this.ilovepdf.startTask({
      tool: "merge",
    });
    const uploadedFiles = [];

    for (const file of this.files) {
      const uploadedFile = await this.ilovepdf.uploadFile({
        task: task.task,
        file,
      });
      uploadedFiles.push({
        server_filename: uploadedFile.server_filename,
      });
    }

    const processedFiles = await this.ilovepdf.processFiles({
      task: task.task,
      tool: "merge",
      serverFilename: uploadedFiles,
    });

    const downloadLink = await this.ilovepdf.downloadFiles({
      task: task.task,
    });
    $.export("$summary", `Successfully merged ${this.files.length} files into one PDF file`);
    return downloadLink;
  },
};
