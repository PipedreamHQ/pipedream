import common from "../common/common-webhook.mjs";
import constants from "../common/constants.mjs";

export default {
  ...common,
  key: "github-new-commit",
  name: "New Commit (Instant)",
  description: "Emit new events on new commits to a repo or branch",
  version: "0.1.14",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    branch: {
      propDefinition: [
        common.props.github,
        "branch",
        (c) => ({
          repoFullname: c.repoFullname,
        }),
      ],
      description: "Branch to monitor for new commits. Defaults to master",
      optional: true,
      withLabel: true,
    },
  },
  methods: {
    ...common.methods,
    getWebhookEvents() {
      return [
        "push",
      ];
    },
    isEventForThisBranch(branch) {
      return !this.branch || branch === this.branch.label;
    },
    generateMeta(data) {
      return {
        id: data.id,
        summary: data.message,
        ts: Date.parse(data.timestamp),
      };
    },
    async loadHistoricalEvents() {
      if (this.branch) {
        this.branch = {
          label: this.branch.split("/")[1],
          value: this.branch.split("/")[0],
        };
      }

      const commitInfo = await this.github.getCommits({
        repoFullname: this.repoFullname,
        sha: this.branch
          ? this.branch.value
          : undefined,
        per_page: constants.HISTORICAL_EVENTS,
      });
      const commits = commitInfo.map((info) => ({
        id: info.commit.url.split("/").pop(),
        timestamp: info.commit.committer.date,
        ...info.commit,
      }));
      this.processCommits(commits);
    },
    processCommits(commits) {
      for (const commit of commits) {
        const meta = this.generateMeta(commit);
        this.$emit(commit, meta);
      }
    },
  },
  async run(event) {
    const { body } = event;

    // skip initial response from Github
    if (body?.zen) {
      console.log(body.zen);
      return;
    }

    const branch = body.ref.split("refs/heads/").pop();
    if (!this.isEventForThisBranch(branch)) {
      return;
    }

    this.processCommits(body.commits);
  },
};
