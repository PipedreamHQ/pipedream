import common from "../common/base.mjs";

export default {
  ...common,
  key: "egnyte-new-file-in-folder",
  name: "New File in Folder",
  description: "Emit new event when a file is added within the specified folder in Egnyte. [See the documentation](https://developers.egnyte.com/docs/read/File_System_Management_API_Documentation#List-File-or-Folder)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceType() {
      return "files";
    },
    generateMeta(file) {
      return {
        id: file.entry_id,
        summary: `New file: ${file.name}`,
        ts: file.uploaded,
      };
    },
  },
};
