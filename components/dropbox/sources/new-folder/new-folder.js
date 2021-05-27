const dropbox = require("../../dropbox.app.js");

module.exports = {
  key: "dropbox-new-folder",
  name: "New Folder",
  version: "0.0.4",
  description:
    "Emits an event when a new folder is created. Make sure the number of files/folders in the watched folder does not exceed 4000.",
  props: {
    dropbox,
    path: { propDefinition: [dropbox, "path"] },
    recursive: { propDefinition: [dropbox, "recursive"] },
    dropboxApphook: {
      type: "$.interface.apphook",
      appProp: "dropbox",
      static: [],
    },
    db: "$.service.db",
  },
  hooks: {
    async activate() {
      await this.dropbox.initState(this);
    },
  },
  async run(event) {
    const updates = await this.dropbox.getUpdates(this);
    for (update of updates) {
      if (update[".tag"] == "folder") {
        this.$emit(update);
      }
    }
  },
};
