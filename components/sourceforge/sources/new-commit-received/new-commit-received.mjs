import sourceforge from "../../sourceforge.app.mjs";

export default {
  key: "sourceforge-new-commit-received",
  name: "New Commit Received (Instant)",
  description: "Emit new event when a repository receives a new commit.",
  version: "0.0.1",
  type: "source",
  props: {
    sourceforge,
    http: "$.interface.http",
    db: "$.service.db",
    project: {
      propDefinition: [
        sourceforge,
        "project",
      ],
    },
  },
  hooks: {
    async activate() {
      const { _id: hookId } = await this.sourceforge.createWebhook({
        project: this.project,
        params: {
          url: this.http.endpoint,
        },
      });
      this._setHookId(hookId);
    },
    async deactivate() {
      const hookId = this._getHookId();
      await this.sourceforge.deleteWebhook({
        project: this.project,
        hookId,
      });
    },
  },
  methods: {
    _getHookId() {
      return this.db.get("hookId");
    },
    _setHookId(hookId) {
      this.db.set("hookId", hookId);
    },
    generateMeta(commit) {
      return {
        id: commit.id,
        summary: commit.message,
        ts: Date.parse(commit.timestamp),
      };
    },
  },
  async run(event) {
    const { body: { commits = [] } } = event;

    for (const commit of commits) {
      const meta = this.generateMeta(commit);
      this.$emit(commit, meta);
    }
  },
};
