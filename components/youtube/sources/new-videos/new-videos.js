const common = require("../common.js");

module.exports = {
  ...common,
  key: "youtube-new-videos",
  name: "New Videos",
  description: "Emits an event for each new Youtube video the user posts.",
  version: "0.0.2",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getParams() {
      return {
        forMine: true,
      };
    },
  },
};