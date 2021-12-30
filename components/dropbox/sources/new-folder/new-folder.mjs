import dropbox from "../../dropbox.app.mjs";

export default {
  key: "dropbox-new-folder",
  name: "New Folder",
  version: "0.0.5",
  description: "Emits an event when a new folder is created. Make sure the number of files/folders in the watched folder does not exceed 4000.",
  props: {
    dropbox,
    path: {
      propDefinition: [
        dropbox,
        "pathFolder",
        () => ({
          returnSimpleString: true,
        }),
      ],
    },
    recursive: {
      propDefinition: [
        dropbox,
        "recursive",
      ],
    },
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
  methods: {
    getMeta(id, summary) {
      return {
        id,
        summary,
        tz: Date.now(),
      };
    },
  },
  async run() {
    const updates = await this.dropbox.getUpdates(this);
    for (const update of updates) {
      if (update[".tag"] == "folder") {
        this.$emit(update, this.getMeta(update.id, update.path_display));
      }
    }
  },
};
