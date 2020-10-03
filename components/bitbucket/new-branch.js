const bitbucket = require("https://github.com/PipedreamHQ/pipedream/components/bitbucket/bitbucket.app.js");

module.exports = {
  name: "New Branch (Instant)",
  description: "Emits an event when a new branch is created",
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
  },
  hooks: {
    async activate() {
      const hookParams = {
        description: "Pipedream - New Branch",
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
    isNewBranch(change) {
      const expectedChangeTypes = new Set([
        "branch",
        "named_branch",
      ]);
      return (
        change.created &&
        expectedChangeTypes.has(change.new.type)
      );
    },
    generateMeta(data) {
      const { headers, change } = data;
      const newBranchName = change.new.name;
      const summary = `New Branch: ${newBranchName}`;
      const ts = +new Date(headers["x-event-time"]);
      const compositeId = `${newBranchName}-${ts}`;
      return {
        id: compositeId,
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

    const { changes = [] } = body.push;
    changes
      .filter(this.isNewBranch)
      .forEach(change => {
        const data = {
          ...body,
          change,
        };
        const meta = this.generateMeta({
          headers,
          change,
        });
        this.$emit(data, meta);
      });
  },
};
