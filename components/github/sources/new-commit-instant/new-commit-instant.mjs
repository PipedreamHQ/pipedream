import common from "../common/common-webhook.mjs";
const { github } = common.props;

export default {
  ...common,
  key: "github-new-commit-instant",
  name: "New Commit (Instant)",
  description: "Emit new events on new commits to a repo or branch",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    branch: {
      propDefinition: [
        github,
        "branch",
        (c) => ({
          repoFullname: c.repoFullname,
        }),
      ],
      description: "Branch to monitor for new commits",
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    getEventNames() {
      return [
        "push",
      ];
    },
    isEventForThisBranch(branch) {
      return !this.branch || branch === this.branch;
    },
    generateMeta(data) {
      return {
        id: data.id,
        summary: data.message,
        ts: Date.parse(data.timestamp),
      };
    },
    async loadHistoricalData() {
      const commits = await this.github.getCommits({
        repoFullname: this.repoFullname,
        data: {
          per_page: 25,
          page: 1,
        },
      });
      console.log("commits", commits);
    },
    emitEvent(body) {
      const branch = body.ref.split("refs/heads/").pop();
      if (!this.isEventForThisBranch(branch)) {
        return;
      }
      const { commits } = body;
      for (const commit of commits) {
        const meta = this.generateMeta(commit);
        this.$emit(commit, meta);
      }
    },
  },
};
