const gitlab = require("https://github.com/PipedreamHQ/pipedream/components/gitlab/gitlab.app.js");

module.exports = {
  name: "New Merge Request (Instant)",
  description: "Emits an event when a new merge request is created",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    gitlab,
    projectId: { propDefinition: [gitlab, "projectId"] },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  hooks: {
    async activate() {
      const hookParams = {
        merge_requests_events: true,
        url: this.http.endpoint,
      };
      const opts = {
        hookParams,
        projectId: this.projectId,
      };
      const { hookId, token } = await this.gitlab.createHook(opts);
      console.log(
        `Created "merge request events" webhook for project ID ${this.projectId}.
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
    isNewMergeRequest(body) {
      const { action } = body.object_attributes;
      const expectedAction = "open";
      return action === expectedAction;
    },
    generateMeta(data) {
      const {
        id,
        created_at,
        title,
      } = data.object_attributes;
      const { name, username } = data.user;
      const summary = `New Merge Request: "${title}" by ${name} (${username})`;
      const ts = +new Date(created_at);
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

    // Gitlab doesn't offer a specific hook for "new merge request" events,
    // but such event can be deduced from the payload of "merge request" events.
    if (this.isNewMergeRequest(body)) {
      const meta = this.generateMeta(body);
      this.$emit(body, meta);
    }
  },
};
