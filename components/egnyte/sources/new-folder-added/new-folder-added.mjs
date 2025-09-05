import common from "../common/base.mjs";

export default {
  ...common,
  key: "egnyte-new-folder-added",
  name: "New Folder",
  description: "Emit new event when a folder is added within the specified folder in Egnyte. [See the documentation](https://developers.egnyte.com/docs/read/File_System_Management_API_Documentation#List-File-or-Folder).",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceType() {
      return "folders";
    },
    generateMeta(folder) {
      return {
        id: folder.folder_id,
        summary: `New folder: ${folder.name}`,
        ts: folder.uploaded,
      };
    },
  },
};
