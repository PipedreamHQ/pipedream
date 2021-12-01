import baseNewFolder from "../new-folder/new-folder.mjs";
import baseNewFileInFolder from "../new-file-in-folder/new-file-in-folder.mjs";
import { toSingleLineString } from "../common/utils.mjs";

export default {
  ...baseNewFolder,
  ...baseNewFileInFolder,
  type: "source",
  key: "microsoft_onedrive-new-folder-in-folder",
  name: "New Folder in Folder (Instant)",
  description: toSingleLineString(`
    Emit an event when a new folder is created under a
    directory tree in a OneDrive drive
  `),
  version: "0.0.1",
  dedupe: "unique",
  props: {
    ...baseNewFolder.props,
    ...baseNewFileInFolder.props,
  },
  methods: {
    ...baseNewFolder.methods,
    ...baseNewFileInFolder.methods,
  },
};
