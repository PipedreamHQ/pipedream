import gitlab from "../../gitlab.app.mjs";
import base from "../common/base.mjs";
import { eventTypes } from "../common/hook-events.mjs";

export default {
  ...base,
  key: "gitlab-new-commit",
  name: "New Commit (Instant)",
  description: "Emit new event when a new commit is pushed to a branch",
  version: "0.1.1",
  dedupe: "unique",
  type: "source",
  props: {
    ...base.props,
    refName: {
      propDefinition: [
        gitlab,
        "branch",
        (c) => ({
          projectId: c.projectId,
        }),
      ],
      optional: true,
    },
  },
  hooks: {
    ...base.hooks,
    async activate() {
      await this.activateHook(eventTypes.PUSH_EVENT);
    },
  },
  methods: {
    ...base.methods,
    isEventForThisBranch(branch) {
      return !this.refName || branch === this.refName;
    },
    generateMeta(commit) {
      const {
        id,
        message,
        shortId,
        committedDate,
      } = commit;
      return {
        id,
        summary: `New commit: ${message} (${shortId})`,
        ts: +new Date(committedDate),
      };
    },
    async emitEvent(event) {
      const refName = event.ref.split("refs/heads/").pop();
      if (!this.isEventForThisBranch(refName)) {
        return;
      }

      // Gitlab "push events" are only provisioned with at most
      // 20 commit objects (which also lack information when compared
      // to the Commits API). The amount of new commits is specified
      // in a separate variable called `total_commits_count`, which
      // we'll use to keep track of the commits that we need to emit
      // downstream.
      // See https://gitlab.com/help/user/project/integrations/webhooks#push-events
      const { total_commits_count: totalCommitsCount } = event;
      if (totalCommitsCount <= 0) return;

      const commits = await this.gitlab.listCommits(this.projectId, {
        refName,
        max: Math.min(50, totalCommitsCount),
      });

      // We need to collect all the relevant commits, sort
      // them in reverse order (since the Gitlab API sorts them
      // from most to least recent) and emit an event for each
      // one of them.
      commits.reverse().forEach((commit) => {
        const meta = this.generateMeta(commit);
        this.$emit(commit, meta);
      });
    },
  },
};
