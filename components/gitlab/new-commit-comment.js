const gitlab = require("https://github.com/PipedreamHQ/pipedream/components/gitlab/gitlab.app.js");

module.exports = {
  name: "New Commit Comment (Instant)",
  description: "Emits an event when a commit receives a comment",
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
        note_events: true,
        url: this.http.endpoint,
      };
      const opts = {
        hookParams,
        projectId: this.projectId,
      };
      const { hookId, token } = await this.gitlab.createHook(opts);
      console.log(
        `Created "note events" webhook for project ID ${this.projectId}.
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
    isCommentOnCommit(body) {
      const noteableType = body.object_attributes.noteable_type;
      const expectedNoteableType = "Commit";
      return noteableType === expectedNoteableType;
    },
    generateMeta(data) {
      const { comment } = data;
      const { name, username } = data.user;
      const {
        id,
        created_at,
        commit_id,
      } = comment;
      const summary = `New comment by ${name} (${username}) on commit ${commit_id}`;
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

    // Gitlab doesn't offer a specific hook for "commit comments" events,
    // but such event can be deduced from the payload of "note" events.
    if (this.isCommentOnCommit(body)) {
      const { user, object_attributes } = body;
      const meta = this.generateMeta({
        user,
        comment: object_attributes,
      });
      this.$emit(body, meta);
    }
  },
};
