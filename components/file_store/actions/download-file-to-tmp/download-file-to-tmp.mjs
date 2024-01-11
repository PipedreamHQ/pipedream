import app from "../../file_store.app.mjs";

export default {
  key: "file_store-download-file-to-tmp",
  name: "Download File to /tmp",
  description: "Downloads a file from the File Store to the local `/tmp` directory. [See the documentation](https://pipedream.com/docs/projects/file-stores/reference/#file-tofile-path)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    filePath: {
      propDefinition: [
        app,
        "filePath",
      ],
      description: "The path to the file to download.",
    },
    outputFilename: {
      type: "string",
      label: "Output Filename",
      description: "The name of the file to be saved in the `/tmp` folder. If not specified, the original filename will be used.",
      optional: true,
    },
  },
  async run({ $ }) {
    const { filePath } = this;
    const filename = this.outputFilename || filePath.split("/").pop();
    const outputPath = filename.includes("tmp/")
      ? filename
      : `/tmp/${filename}`;

    const file = await $.files.open(filePath).toFile(outputPath);

    $.export("$summary", `Successfully downloaded file to ${outputPath}`);
    return file;
  },
};
