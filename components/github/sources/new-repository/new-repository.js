const common = require("../common-polling.js");

module.exports = {
  ...common,
  key: "github-new-repository",
  name: "New Repository",
  description: "Emit new events when new repositories are created",
  version: "0.0.4",
  type: "source",
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
  async run() {
    let since = this.db.get("since");

    const repos = await this.github.getRepos({
      sort: "created",
      direction: "asc",
      since,
    });

    let maxDate = since;
    for (const repo of repos) {
      if (!maxDate || new Date(repo.created_at) > new Date(maxDate)) {
        maxDate = repo.created_at;
      }
      const meta = this.generateMeta(repo);
      this.$emit(repo, meta);
      since = repo.created_at;
    }

    this.db.set("since", since);
  },
};
