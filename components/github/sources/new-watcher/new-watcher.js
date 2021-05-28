const github = require("../../github.app.js");
const common = require("../common-polling.js");

module.exports = {
  ...common,
  key: "github-new-watcher",
  name: "New Watcher",
  description: "Emit an event when a new watcher is added to a repository.",
  version: "0.0.1",
  dedupe: "last",
  props: {
    ...common.props,
    repoFullName: { propDefinition: [github, "repoFullName"] },
  },
  methods: {
    generateMeta(data) {
      const ts = Date.now();
      return {
        id: data.id,
        summary: data.login,
        ts,
      };
    },
  },
  async run(event) {
    const watchers = await this.github.getWatchers({
      repoFullName: this.repoFullName,
    });

    watchers.forEach((watcher) => {
      const meta = this.generateMeta(watcher);
      this.$emit(watcher, meta);
    });
  },
};