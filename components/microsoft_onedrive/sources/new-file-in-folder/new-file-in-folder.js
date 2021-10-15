const onedrive = require("../../microsoft_onedrive.app");
const base = require("../new-file/new-file");
const { toSingleLineString } = require("../common/utils");

module.exports = {
  ...base,
  type: "source",
  key: "microsoft_onedrive-new-file-in-folder",
  name: "New File in Folder (Instant)",
  description: toSingleLineString(`
    Emit an event when a new file is added to a
    specific directory tree in a OneDrive drive
  `),
  version: "0.0.2",
  dedupe: "unique",
  props: {
    ...base.props,
    folder: {
      propDefinition: [
        onedrive,
        "folder",
      ],
    },
  },
  methods: {
    ...base.methods,
    getDeltaLinkParams() {
      return {
        folderId: this.folder,
      };
    },
  },
};
