const get = require("lodash/get");
const onedrive = require("../../microsoft_onedrive.app");
const { toSingleLineString } = require("../common/utils");
const base = require("../new-file-in-folder/new-file-in-folder");

module.exports = {
  ...base,
  type: "source",
  key: "microsoft_onedrive-new-file-of-types-in-folder",
  name: "New File of Types in Folder (Instant)",
  description: toSingleLineString(`
    Emit an event when a new file of a specific type is created
    under a directory tree in a OneDrive drive
  `),
  version: "0.0.1",
  dedupe: "unique",
  props: {
    ...base.props,
    folder: {
      propDefinition: [
        onedrive,
        "folder",
      ],
      description: toSingleLineString(`
        The OneDrive folder to watch for new files (leave empty to watch the
        entire drive)
      `),
      optional: true,
    },
    fileTypes: {
      propDefinition: [
        onedrive,
        "fileTypes",
      ],
    },
  },
  methods: {
    ...base.methods,
    isItemTypeRelevant(driveItem) {
      const fileType = get(driveItem, [
        "file",
        "mimeType",
      ]);
      return (
        base.methods.isItemTypeRelevant.call(this, driveItem) &&
        this.fileTypes.includes(fileType)
      );
    },
  },
};
