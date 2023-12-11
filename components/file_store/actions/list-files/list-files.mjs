import fileStore from "../../file_store.app.mjs";

export default {
  key: "file_store-list-files",
  name: "List Files",
  description: "Lists all files in the specified directory of the file store. [See the documentation](https://pipedream.com/docs/projects/file-stores/reference/)",
  version: "0.0.1",
  type: "action",
  props: {
    fileStore,
    directory: {
      propDefinition: [
        fileStore,
        "directory",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const directoryPath = this.directory || "";
    const files = await this.fileStore.listFiles({
      path: directoryPath,
    });

    $.export("$summary", `Successfully listed files in the directory: ${directoryPath || "root"}`);
    return files;
  },
};
