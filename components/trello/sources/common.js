const trello = require("../trello.app.js");

module.exports = {
  props: {
    trello,
    db: "$.service.db",
  },
  methods: {
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
    generateCommonMeta({ id, name: summary }) {
      return {
        id,
        summary,
        ts: Date.now(),
      };
    },
    emitEvent(result) {
      const meta = this.generateMeta(result);
      this.$emit(result, meta);
    },
  },
};