const common = require("./webhook.js");

module.exports = {
  ...common,
  methods: {
    ...common.methods,
    generateMeta({
      id, name, created,
    }) {
      return {
        id,
        summary: name.text,
        ts: Date.parse(created),
      };
    },
  },
};
