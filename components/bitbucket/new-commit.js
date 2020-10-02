const bitbucket = require("https://github.com/PipedreamHQ/pipedream/components/bitbucket/bitbucket.app.js");

module.exports = {
  name: "New Commit (Instant)",
  description: "Emits an event when a new commit is pushed to a branch",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    bitbucket,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    workspaceId: { propDefinition: [bitbucket, "workspaceId"] },
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
  hooks: {
    async activate() {
      const hookParams = {
        description: "Pipedream - New Commit",
        url: this.http.endpoint,
        active: true,
        events: [
          "repo:push"
        ],
      };
      const opts = {
        workspaceId: this.workspaceId,
        repositoryId: this.repositoryId,
        hookParams,
      };
      const { hookId } = await this.bitbucket.createHook(opts);
      console.log(
        `Created "repository push" webhook for repository "${this.workspaceId}/${this.repositoryId}".
        (Hook ID: ${hookId}, endpoint: ${hookParams.url})`
      );
      this.db.set("hookId", hookId);
    },
    async deactivate() {
      const hookId = this.db.get("hookId");
      const opts = {
        workspaceId: this.workspaceId,
        repositoryId: this.repositoryId,
        hookId,
      };
      await this.bitbucket.deleteHook(opts);
      console.log(
        `Deleted webhook for repository "${this.workspaceId}/${this.repositoryId}".
        (Hook ID: ${hookId})`
      );
    },
  },
  methods: {
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
    generateMeta(commit) {
      const {
        hash,
        message,
        date,
      } = commit;
      const summary = `New commit: ${message} (${hash})`;
      const ts = +new Date(date);
      return {
        id: hash,
        summary,
        ts,
      };
    },
  },
  async run(event) {
    const { headers, body } = event;

    // Reject any calls not made by the proper BitBucket webhook.
    if (!this.bitbucket.isValidSource(headers, this.db)) {
      this.http.respond({
        status: 404,
      });
      return;
    }

    // Acknowledge the event back to BitBucket.
    this.http.respond({
      status: 200,
    });

    // Push events can be for different branches, tags and
    // causes. We need to make sure that we're only processing events
    // that are related to new commits in the particular branch
    // that the user indicated.
    const { changes = [] } = body.push;
    const isEventRelevant = changes
      .filter(this.isEventForThisBranch)
      .filter(this.doesEventContainNewCommits)
      .length > 0;
    if (isEventRelevant) {
      const lastProcessedCommitHash = this.db.get("lastProcessedCommitHash");
      const allCommits = this.bitbucket.getCommits({
        workspaceId: this.workspaceId,
        repositoryId: this.repositoryId,
        branchName: this.branchName,
        lastProcessedCommitHash,
      });

      // We need to collect all the relevant commits, sort
      // them in reverse order (since the BitBucket API sorts them
      // from most to least recent) and emit an event for each
      // one of them.
      const allCommitsCollected = [];
      for await (const commit of allCommits) {
        allCommitsCollected.push(commit);
      };

      // We store the most recent commit hash in the DB so that
      // we don't query the BitBucket API for commits beyond this point
      // for subsequent events.
      lastProcessedCommitHash = allCommitsCollected[0].id;
      this.db.set("lastProcessedCommitHash", lastProcessedCommitHash);

      allCommitsCollected.reverse().forEach(commit => {
        const meta = this.generateMeta(commit)
        this.$emit(commit, meta);
      });
    }
  },
};
