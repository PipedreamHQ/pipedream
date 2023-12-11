import fileStore from "../../file_store.app.mjs";

export default {
  key: "file_store-delete-file",
  name: "Delete File",
  description: "Deletes a file from the File Store. [See the documentation](https://pipedream.com/docs/projects/file-stores/reference/)",
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
    const path = `${this.directory
      ? `${this.directory}/`
      : ""}${this.file}`;

    const response = await this.fileStore._makeRequest({
      method: "DELETE",
      path: `/files/open/${encodeURIComponent(path)}`,
    });

    $.export("$summary", `Successfully deleted file: ${path}`);
    return response;
  },
};
