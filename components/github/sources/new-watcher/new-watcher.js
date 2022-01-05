const github = require("../../github.app.js");
const common = require("../common-polling.js");

module.exports = {
  ...common,
  key: "github-new-watcher",
  name: "New Watcher",
  description: "Emit new events when new watchers are added to a repository",
  version: "0.0.3",
  type: "source",
  dedupe: "last",
  props: {
    ...common.props,
    repoFullName: {
      propDefinition: [
        github,
        "repoFullName",
      ],
    },
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
  async run() {
    const watchers = await this.github.getWatchers({
      repoFullName: this.repoFullName,
    });

    watchers.forEach((watcher) => {
      const meta = this.generateMeta(watcher);
      this.$emit(watcher, meta);
    });
  },
};
