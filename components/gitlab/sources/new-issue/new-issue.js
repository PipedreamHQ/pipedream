const gitlab = require("../../gitlab.app.js");

module.exports = {
  key: "gitlab-new-issue",
  name: "New Issue (Instant)",
  description: "Emit an event when new issues are created in a project",
  version: "0.0.2",
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
        issues_events: true,
        url: this.http.endpoint,
      };
      const opts = {
        hookParams,
        projectId: this.projectId,
      };
      const { hookId, token } = await this.gitlab.createHook(opts);
      console.log(
        `Created "issues events" webhook for project ID ${this.projectId}.
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
    isNewIssue(body) {
      const { previous } = body.changes.updated_at;
      return previous === undefined || previous === null;
    },
    generateMeta(data) {
      const { issue } = data;
      const { name, username } = data.user;
      const { id, iid, created_at, title } = issue;
      const summary = `New issue by ${name} (${username}): #${iid} ${title}`;
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

    // Gitlab doesn't offer a specific hook for "new issue" events,
    // but such event can be deduced from the payload of "issues" events.
    if (this.isNewIssue(body)) {
      const { user, object_attributes } = body;
      const meta = this.generateMeta({
        user,
        issue: object_attributes,
      });
      this.$emit(body, meta);
    }
  },
};
