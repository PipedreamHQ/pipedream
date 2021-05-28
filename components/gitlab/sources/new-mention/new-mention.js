const gitlab = require("../../gitlab.app.js");

module.exports = {
  key: "gitlab-new-mention",
  name: "New Mention (Instant)",
  description: "Emit an event when you are @mentioned in a new commit, comment, issue or pull request.",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    gitlab,
    projectId: { propDefinition: [gitlab, "projectId"] },
    username: {
      label: "Gitlab Username",
      description: "The Gitlab user alias whose mentions will emit events.",
      type: "string",
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
        issues_events: true,
        note_events: true,
        url: this.http.endpoint,
      };
      const opts = {
        hookParams,
        projectId: this.projectId,
      };
      const { hookId, token } = await this.gitlab.createHook(opts);
      console.log(
        `Created "issues/note events" webhook for project ID ${this.projectId}.
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
    isUserMentioned(body) {
      const pattern = new RegExp(`\\B@${this.username}\\b`);
      const groomedAttributes = {
        ...body.object_attributes,
        // We want to exclude some fields, since they do not map
        // to the content being updated, and could result in false
        // positives (e.g. if a URL contains `@someuser` in its path).
        url: '',
      };
      const changeSummary = JSON.stringify(groomedAttributes);
      return pattern.test(changeSummary);
    },
    generateMeta(data) {
      const { changedEntity } = data;
      const {
        id,
        created_at,
        event_type,
        noteable_type,
      } = changedEntity;

      const { username } = data.user;
      const entityType = noteable_type ? noteable_type.toLowerCase() : event_type;
      const summary = `New mention of ${this.username} in ${entityType} by ${username}`;

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

    // Gitlab doesn't offer a specific hook for "new label" events,
    // but such event can be deduced from the payload of "issues" events.
    if (this.isUserMentioned(body)) {
      const { user, object_attributes } = body;
      const meta = this.generateMeta({
        user,
        changedEntity: object_attributes,
      });
      this.$emit(body, meta);
    }
  },
};
