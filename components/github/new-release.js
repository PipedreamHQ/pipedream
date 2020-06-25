//const github = require("https://github.com/PipedreamHQ/pipedream/components/github/github.app.js");
const github = require("./github.app.js");

module.exports = {
  name: "New Releases",
  description: "Triggers on new releases.",
  version: "0.0.1",
  props: {
    db: "$.service.db",
    github,
    repoFullName: { propDefinition: [github, "repoFullName"] },
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 5,
      },
    },
  },
  dedupe: "greatest",
  async run(event) {
    console.log(this.repoFullName)
    const releases = await this.github.getReleases({
      repoFullName: this.repoFullName,
    })
    console.log(releases)
    releases.reverse().forEach(release => {
      if(release.published_at) {
        this.$emit(release, {
          summary: `${release.name} ${release.body}`,
          id: `${release.id}`
        })
      }
    })
  },
};