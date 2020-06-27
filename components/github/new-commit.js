//const github = require("https://github.com/PipedreamHQ/pipedream/components/github/github.app.js");
const github = require("./github.app.js");

module.exports = {
  name: "New Commits",
  description: "Triggers on new commits.",
  version: "0.0.1",
  props: {
    db: "$.service.db",
    github,
    repoFullName: { propDefinition: [github, "repoFullName"] },
    branch: { 
      propDefinition: [github, "branch", c => ({ repoFullName: c.repoFullName })],
      description: "Branch to pull commits from. If unspecified, will use the repository's default branch (usually master or develop)."
    },
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 5,
      },
    },
  },
  dedupe: "last",
  async run(event) {
    const config = {
      repoFullName: this.repoFullName,
      sha: this.branch,
    }
    console.log(config)
    const commits = await this.github.getCommits(config)
    console.log(commits)
    commits.reverse().forEach(commit => {
      this.$emit(commit, {
        summary: commit.commit.message,
        id: commit.sha
      })
    })
  },
};
