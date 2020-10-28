const github = require("../../github.app.js");

module.exports = {
  key: "github-new-repository",
  name: "New Repository",
  description: "Emit an event when a new repository is created",
  version: "0.0.1",
  props: {
    github,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 5,
      },
    },
  },
  dedupe: "last",
  async run(event) {
    const repos = await this.github.getRepos({
      sort: 'created',
      direction: 'desc',
    })

    repos.forEach(repo => {
      this.$emit(repo, {
        summary: repo.full_name,
        ts: repo.created_at && +new Date(repo.created_at),
        id: repo.id,
      })
    })
  },
};
