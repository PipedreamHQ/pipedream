import app from "../../file_store.app.mjs";

export default {
  key: "file_store-delete-file",
  name: "Delete File",
  description: "Deletes a file from the File Store. [See the documentation](https://pipedream.com/docs/projects/file-stores/reference/#file-delete)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    filePath: {
      propDefinition: [
        app,
        "filePath",
      ],
      description: "The path to the file to delete.",
    },
  },
  async run({ $ }) {
    const { filePath } = this;
    const response = await $.files.open(filePath).delete();
    $.export("$summary", `Successfully deleted file "${filePath}"`);
    return response;
  },
};
