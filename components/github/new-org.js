//const github = require("https://github.com/PipedreamHQ/pipedream/components/github/github.app.js");

const github = require("./github.app.js");

module.exports = {
  name: "New Organization",
  description: "New org created.",
  version: "0.0.1",
  props: {
    db: "$.service.db",
    github,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 5,
      },
    },
  },
  //dedupe: "last",
  async run(event) {
    const orgs = await this.github.getOrgs()
    console.log(orgs)
    /*
    repos.forEach(repo => {
      this.$emit(repo, {
        summary: repo.full_name,
        ts: repo.created_at && +new Date(repo.created_at),
        id: repo.id,
      })
    })
    */
  },
};