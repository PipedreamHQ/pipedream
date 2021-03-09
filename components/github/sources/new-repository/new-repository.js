const common = require("../common-polling.js");

module.exports = {
  ...common,
  key: "github-new-repository",
  name: "New Repository",
  description: "Emit an event when a new repository is created",
  version: "0.0.2",
  dedupe: "last",
  methods: {
    generateMeta(data) {
      const ts = new Date(data.created_at).getTime();
      return {
        id: data.id,
        summary: data.full_name,
        ts,
      };
    },
  },
  async run(event) {
    const since = this.db.get("since");

    const repos = await this.github.getRepos({
      sort: "created",
      direction: "desc",
    });

    let maxDate = since;
    for (const repo of repos) {
      if (!maxDate || new Date(repo.created_at) > new Date(maxDate)) {
        maxDate = repo.created_at;
      }
      const meta = this.generateMeta(repo);
      this.$emit(repo, meta);
    }

    if (maxDate !== since) {
      this.db.set("since", maxDate);
    }
  },
};