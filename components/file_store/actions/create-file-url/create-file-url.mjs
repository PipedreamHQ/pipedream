import fileStoreApp from "../../file_store.app.mjs";

export default {
  key: "file_store-create-file-url",
  name: "Create File URL",
  description: "Creates a URL for a file in the File Store. [See the documentation](https://pipedream.com/docs/projects/file-stores/reference/#file-tourl)",
  version: "0.0.1",
  type: "action",
  props: {
    fileStoreApp,
    filePath: {
      type: "string",
      label: "File Path",
      description: "The path to the file to create a URL for.",
    },
  },
  async run({ $ }) {
    const { filePath } = this;
    const file = await $.files.open(filePath);
    $.export("$summary", `Successfully created a URL for "${filePath}"`);
    return file.toUrl();
  },
};
