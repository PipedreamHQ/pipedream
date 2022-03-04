import dropbox from "../dropbox.app.mjs";

export default {
  props: {
    dropbox,
    db: "$.service.db",
    path: {
      propDefinition: [
        dropbox,
        "pathFolder",
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
};
