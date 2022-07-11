/* eslint @typescript-eslint/no-var-requires: "off" */
import common from "../common/common-webhook.mjs";
import getOwnerAndRepo from "../../actions/common/utils.mjs";

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
        common.props.github,
        "branch",
        (c) => ({
          repoFullName: c.repoFullName,
        }),
      ],
      description: "Branch to monitor for new commits",
      optional: true,
    },
  },
  methods: {
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
      const commits = await this.github.getCommits(getOwnerAndRepo(this.repoFullName));
      console.log("commits", commits);
      // const ts = new Date().getTime();
      // return branches.map((branch) => ({
      //   main: branch,
      //   sub: {
      //     id: `${branch.name}-${ts}`,
      //     summary: `New branch ${branch.name} created`,
      //     ts,
      //   },
      // }));
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
