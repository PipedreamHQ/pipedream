const github = require("../../github.app.js");
const common = require("../common-polling.js");

module.exports = {
  ...common,
  key: "github-new-commit",
  name: "New Commit",
  description: "Emit new events on new commits to a repo or branch",
  version: "0.0.5",
  type: "source",
  props: {
    ...common.props,
    repoFullName: {
      propDefinition: [
        github,
        "repoFullName",
      ],
    },
    branch: {
      propDefinition: [
        github,
        "branch",
        (c) => ({
          repoFullName: c.repoFullName,
        }),
      ],
      description:
        "Branch to monitor for new commits. If no branch is selected, the repository’s default branch will be used (usually master).",
    },
  },
  dedupe: "last",
  methods: {
    generateMeta(data) {
      const ts = new Date(data.commit.author.date).getTime();
      return {
        id: data.sha,
        summary: data.commit.message,
        ts,
      };
    },
  },
  async run() {
    const since = this.db.get("since");
    const firstRun = this.db.get("firstRun") ?? true;

    const config = {
      repoFullName: this.repoFullName,
      sha: this.branch,
      since,
    };
    const commits = await this.github.getCommits(config);
    const commitsToEmit = firstRun
      ? commits.slice(0, 10)
      : commits;

    let maxDate = since;
    for (const commit of commitsToEmit) {
      if (!maxDate || new Date(commit.commit.author.date) > new Date(maxDate)) {
        maxDate = commit.commit.author.date;
      }
      const meta = this.generateMeta(commit);
      this.$emit(commit, meta);
    }

    if (maxDate !== since) {
      this.db.set("since", maxDate);
    }

    if (firstRun) {
      this.db.set("firstRun", false);
    }
  },
};
