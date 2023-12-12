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
    },
    filter: {
      type: "string",
      label: "Filter",
      description: "Whether to list only files, directories, or both (default).",
      optional: true,
      options: [
        "Files",
        "Directories",
        "Both",
      ],
      default: "Both",
    },
  },
  async run({ $ }) {
    let result = [], summary = "files and directories";
    const dirs = $.files.dir();

    for await (const dir of dirs) {
      result.push(dir);
    }

    switch (this.filter) {
    case "Files":
      result = result.filter((file) => file.isFile());
      summary = "files";
      break;
    case "Directories":
      result = result.filter((file) => file.isDirectory());
      summary = "directories";
      break;
    default:
      break;
    }

    $.export("$summary", `Successfully listed ${summary} in ${this.directory ?? "the root directory"}`);
    return result;
  },
};
