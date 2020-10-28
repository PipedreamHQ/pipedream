const github = require("../../github.app.js");

module.exports = {
  key: "github-new-commit",
  name: "New Commit",
  description: "Emit an event on new commit to a repo or branch",
  version: "0.0.1",
  props: {
    github,
    repoFullName: { propDefinition: [github, "repoFullName"] },
    branch: { 
      propDefinition: [github, "branch", c => ({ repoFullName: c.repoFullName })],
      description: "Branch to monitor for new commits. If no branch is selected, the repository’s default branch will be used (usually master).",
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
        id: commit.sha,
        ts: commit.commit.author.date && +new Date(commit.commit.author.date),
      })
    })
  },
};
