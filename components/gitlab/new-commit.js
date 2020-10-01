const gitlab = require("https://github.com/PipedreamHQ/pipedream/components/gitlab/gitlab.app.js");

module.exports = {
  name: "New Commit (Instant)",
  description: "Emits an event when a new commit is pushed to a branch",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    gitlab,
    projectId: { propDefinition: [gitlab, "projectId"] },
    branchName: {
      propDefinition: [gitlab, "branchName", c => ({ projectId: c.projectId })],
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  hooks: {
    async activate() {
      const hookParams = {
        push_events: true,
        url: this.http.endpoint,
      };
      const opts = {
        hookParams,
        projectId: this.projectId,
      };
      const { hookId, token } = await this.gitlab.createHook(opts);
      console.log(
        `Created "push events" webhook for project ID ${this.projectId}.
        (Hook ID: ${hookId}, endpoint: ${hookParams.url})`
      );
      this.db.set("hookId", hookId);
      this.db.set("token", token);
    },
    async deactivate() {
      const hookId = this.db.get("hookId");
      const opts = {
        hookId,
        projectId: this.projectId,
      };
      await this.gitlab.deleteHook(opts);
      console.log(
        `Deleted webhook for project ID ${this.projectId}.
        (Hook ID: ${hookId})`
      );
    },
  },
  methods: {
    generateMeta(commit) {
      const {
        id,
        message,
        committed_date,
        short_id,
      } = commit;
      const summary = `New commit: ${message} (${short_id})`;
      const ts = +new Date(committed_date);
      return {
        id,
        summary,
        ts,
      };
    },
  },
  async run(event) {
    const { headers, body } = event;

    // Reject any calls not made by the proper Gitlab webhook.
    if (!this.gitlab.isValidSource(headers, this.db)) {
      this.http.respond({
        status: 404,
      });
      return;
    }

    // Acknowledge the event back to Gitlab.
    this.http.respond({
      status: 200,
    });

    // Gitlab "push events" are only provisioned with at most
    // 20 commit objects (which also lack information when compared
    // to the Commits API). The amount of new commits is specified
    // in a separate variable called `total_commits_count`, which
    // we'll use to keep track of the commits that we need to emit
    // downstream.
    // See https://gitlab.com/help/user/project/integrations/webhooks#push-events
    const { total_commits_count } = body;
    const allCommits = this.gitlab.getCommits({
      projectId: this.projectId,
      branchName: this.branchName,
      totalCommitsCount: total_commits_count,
    });

    // We need to collect all the relevant commits, sort
    // them in reverse order (since the Gitlab API sorts them
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
};
