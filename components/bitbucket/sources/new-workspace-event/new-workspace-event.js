const bitbucket = require("../../bitbucket.app");

module.exports = {
  key: "bitbucket-new-workspace-event",
  name: "New Workspace Event (Instant)",
  description: "Emits an event when a workspace-wide event occurs.",
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
    eventTypes: { propDefinition: [bitbucket, "eventTypes", c => ({ subjectType: "workspace" })] },
  },
  hooks: {
    async activate() {
      const hookParams = {
        description: "Pipedream - Workspace Event",
        url: this.http.endpoint,
        active: true,
        events: this.eventTypes,
      };
      const opts = {
        workspaceId: this.workspaceId,
        hookParams,
      };
      const { hookId } = await this.bitbucket.createWorkspaceHook(opts);
      console.log(
        `Created webhook for workspace "${this.workspaceId}".
        (Hook ID: ${hookId}, endpoint: ${hookParams.url})`
      );
      this.db.set("hookId", hookId);
    },
    async deactivate() {
      const hookId = this.db.get("hookId");
      const opts = {
        workspaceId: this.workspaceId,
        hookId,
      };
      await this.bitbucket.deleteWorkspaceHook(opts);
      console.log(
        `Deleted webhook for repository "${this.workspaceId}".
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
      const summary = `New workspace event: ${eventType}`;
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
