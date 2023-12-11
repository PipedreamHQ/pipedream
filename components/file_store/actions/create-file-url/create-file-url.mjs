import fileStoreApp from "../../file_store.app.mjs";

export default {
  key: "file_store-create-file-url",
  name: "Create File URL",
  description: "Creates a URL for a file in the File Store. [See the documentation](https://pipedream.com/docs/projects/file-stores/reference/)",
  version: "0.0.1",
  type: "action",
  props: {
    fileStoreApp,
    file: {
      type: "string",
      label: "File",
      description: "The name of the file to create a URL for.",
      async options({ prevContext }) {
        const { page = 0 } = prevContext;
        const files = await this.fileStoreApp.listFiles({
          path: "",
          page,
        });
        return files
          .filter((file) => file.isFile())
          .map((file) => ({
            label: file.name,
            value: file.path,
          }));
      },
    },
  },
  async run({ $ }) {
    const { file } = this;
    const fileUrl = await this.fileStoreApp.uploadFileFromPath({
      localFilePath: `/tmp/${file}`,
      fileName: file,
      contentType: "auto/detect", // Assuming content type is to be auto-detected
    });

    $.export("$summary", `Successfully created a URL for the file: ${file}`);
    return fileUrl;
  },
};
