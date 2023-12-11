import fileStore from "../../file_store.app.mjs";

export default {
  key: "file_store-download-file-to-tmp",
  name: "Download File to /tmp",
  description: "Downloads a file from the File Store to the local `/tmp` directory. [See the documentation](https://pipedream.com/docs/projects/file-stores/reference/)",
  version: "0.0.1",
  type: "action",
  props: {
    fileStore,
    directory: {
      propDefinition: [
        fileStore,
        "directory",
      ],
    },
    file: {
      propDefinition: [
        fileStore,
        "file",
        (c) => ({
          directory: c.directory,
        }),
      ],
    },
  },
  async run({ $ }) {
    const localPath = `/tmp/${this.file.split("/").pop()}`;
    await this.fileStore.downloadFile({
      fileName: this.file,
      localPath,
    });

    $.export("$summary", `Successfully downloaded the file to ${localPath}`);
    return localPath;
  },
};
