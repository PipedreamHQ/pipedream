const get = require("lodash/get");
const common = require("../../common");
const { bitbucket } = common.props;

const EVENT_SOURCE_NAME = "New Commit (Instant)";

module.exports = {
  ...common,
  name: EVENT_SOURCE_NAME,
  key: "bitbucket-new-commit",
  description: "Emits an event when a new commit is pushed to a branch",
  version: "0.0.2",
  props: {
    ...common.props,
    repositoryId: {
      propDefinition: [
        bitbucket,
        "repositoryId",
        c => ({ workspaceId: c.workspaceId }),
      ],
    },
    branchName: {
      propDefinition: [
        bitbucket,
        "branchName",
        c => ({
          workspaceId: c.workspaceId,
          repositoryId: c.repositoryId,
        }),
      ],
    },
  },
  methods: {
    ...common.methods,
    getEventSourceName() {
      return EVENT_SOURCE_NAME;
    },
    getHookEvents() {
      return [
        "repo:push",
      ];
    },
    getHookPathProps() {
      return {
        workspaceId: this.workspaceId,
        repositoryId: this.repositoryId,
      };
    },
    isEventForThisBranch(change) {
      const expectedChangeTypes = new Set([
        "branch",
        "named_branch",
      ]);
      if (change.new) {
        const { name, type } = change.new;
        return name === this.branchName && expectedChangeTypes.has(type);
      }
      return false;
    },
    doesEventContainNewCommits(change) {
      return change.commits && change.commits.length > 0;
    },
    getBaseCommitHash(change) {
      return get(change, [
        "old",
        "target",
        "hash",
      ]);
    },
    generateMeta(commit) {
      const {
        hash,
        message,
        date,
      } = commit;
      const commitTitle = message
        .split("\n")
        .shift();
      const summary = `New commit: ${commitTitle} (${hash})`;
      const ts = +new Date(date);
      return {
        id: hash,
        summary,
        ts,
      };
    },
    async processEvent(event) {
      const { body } = event;
      const { changes = [] } = body.push;

      // Push events can be for different branches, tags and
      // causes. We need to make sure that we're only processing events
      // that are related to new commits in the particular branch
      // that the user indicated.
      const newCommitsInThisBranch = changes
        .filter(this.isEventForThisBranch)
        .filter(this.doesEventContainNewCommits);
      const isEventRelevant = newCommitsInThisBranch.length > 0;
      if (!isEventRelevant) {
        return;
      }

      // BitBucket events provide information about the state
      // of an entity before it was changed.
      // Based on that, we can extract the HEAD commit of
      // the relevant branch before new commits were pushed to it.
      const lastProcessedCommitHash = newCommitsInThisBranch
        .map(this.getBaseCommitHash)
        .shift();

      // The event payload contains some commits but it's not exhaustive,
      // so we need to explicitly fetch them just in case.
      const opts = {
        workspaceId: this.workspaceId,
        repositoryId: this.repositoryId,
        branchName: this.branchName,
        lastProcessedCommitHash,
      };
      const allCommits = this.bitbucket.getCommits(opts);

      // We need to collect all the relevant commits, sort
      // them in reverse order (since the BitBucket API sorts them
      // from most to least recent) and emit an event for each
      // one of them.
      const allCommitsCollected = [];
      for await (const commit of allCommits) {
        allCommitsCollected.push(commit);
      };

      allCommitsCollected.reverse().forEach(commit => {
        const meta = this.generateMeta(commit)
        this.$emit(commit, meta);
      });
    },
  },
};
