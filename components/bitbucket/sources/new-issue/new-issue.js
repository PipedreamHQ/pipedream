const bitbucket = require("../../bitbucket.app");

module.exports = {
  key: "bitbucket-new-issue",
  name: "New Issue (Instant)",
  description: "Emits an event when a new issue is created",
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
        description: "Pipedream - New Issue",
        url: this.http.endpoint,
        active: true,
        events: [
          "issue:created"
        ],
      };
      const opts = {
        workspaceId: this.workspaceId,
        repositoryId: this.repositoryId,
        hookParams,
      };
      const { hookId } = await this.bitbucket.createRepositoryHook(opts);
      console.log(
        `Created "issue create" webhook for repository "${this.workspaceId}/${this.repositoryId}".
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
      await this.bitbucket.deleteRepositoryHook(opts);
      console.log(
        `Deleted webhook for repository "${this.workspaceId}/${this.repositoryId}".
        (Hook ID: ${hookId})`
      );
    },
  },
  methods: {
    generateMeta(data) {
      const { headers, body } = data;
      const { id, title } = body.issue;
      const summary = `New Issue: #${id} ${title}`;
      const ts = +new Date(headers["x-event-time"]);
      return {
        id,
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

    const meta = this.generateMeta(event);
    this.$emit(body, meta);
  },
};
