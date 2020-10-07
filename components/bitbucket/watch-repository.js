const bitbucket = require("https://github.com/PipedreamHQ/pipedream/components/bitbucket/bitbucket.app.js");

module.exports = {
  name: "New Repository Event (Instant)",
  description: "Emits an event when a repository-wide event occurs.",
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
    eventTypes: { propDefinition: [bitbucket, "eventTypes", c => ({ subjectType: "repository" })] },
  },
  hooks: {
    async activate() {
      const hookParams = {
        description: "Pipedream - Repository Event",
        url: this.http.endpoint,
        active: true,
        events: this.eventTypes,
      };
      const opts = {
        workspaceId: this.workspaceId,
        repositoryId: this.repositoryId,
        hookParams,
      };
      const { hookId } = await this.bitbucket.createRepositoryHook(opts);
      console.log(
        `Created webhook for repository "${this.workspaceId}/${this.repositoryId}".
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
      const {
        "x-request-uuid": id,
        "x-event-key": eventType,
        "x-event-time": eventDate,
      } = data.headers;
      const summary = `New repository event: ${eventType}`;
      const ts = +new Date(eventDate);
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

    const data = {
      headers,
      body,
    };
    const meta = this.generateMeta(data);
    this.$emit(data, meta);
  },
};
