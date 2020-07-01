const github = require("https://github.com/PipedreamHQ/pipedream/components/github/github.app.js");
//const github = require("./github.app.js");

module.exports = {
  name: "New Commit",
  description: "Triggers on new commits to a repo or branch",
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
