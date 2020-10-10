const bitbucket = require("https://github.com/PipedreamHQ/pipedream/components/bitbucket/bitbucket.app.js");

module.exports = {
  name: "New Pull Request (Instant)",
  description: "Emits an event when a new pull request is created",
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
        description: "Pipedream - New Pull Request",
        url: this.http.endpoint,
        active: true,
        events: [
          "pullrequest:created"
        ],
      };
      const opts = {
        workspaceId: this.workspaceId,
        repositoryId: this.repositoryId,
        hookParams,
      };
      const { hookId } = await this.bitbucket.createHook(opts);
      console.log(
        `Created "pull request create" webhook for repository "${this.workspaceId}/${this.repositoryId}".
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
    generateMeta(data) {
      const { headers, body } = data;
      const { id, title } = body.pullrequest;
      const summary = `New Pull Request: ${title}`;
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
