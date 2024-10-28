import crowdin from "../../crowdin.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "crowdin-new-comment-issue-instant",
  name: "New Comment or Issue Created",
  description: "Emit new event when a user creates a comment or an issue in Crowdin. [See the documentation](https://support.crowdin.com/developer/api/v2/)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    crowdin,
    http: {
      type: "$.interface.http",
      customResponse: false,
    },
    db: "$.service.db",
    projectId: {
      propDefinition: [
        crowdin,
        "projectId",
        async (c) => ({
          projectId: c.projectId,
        }),
      ],
    },
    name: {
      propDefinition: [
        crowdin,
        "name",
      ],
    },
  },
  methods: {
    _getWebhookId() {
      return this.db.get("webhookId");
    },
    _setWebhookId(id) {
      this.db.set("webhookId", id);
    },
  },
  hooks: {
    async deploy() {
      const events = await this.crowdin.emitCommentOrIssueEvent({
        projectId: this.projectId,
        name: this.name,
      });

      for (const event of events.slice(-50)) {
        this.$emit(event, {
          id: event.id,
          summary: `New event: ${event.name}`,
          ts: Date.parse(event.ts),
        });
      }
    },
    async activate() {
      const hookId = await this.crowdin.emitCommentOrIssueEvent({
        projectId: this.projectId,
        name: this.name,
      });
      this._setWebhookId(hookId);
    },
    async deactivate() {
      const id = this._getWebhookId();
      // Logic to delete the webhook using the stored webhook ID
    },
  },
  async run(event) {
    console.log("Emitting event...");
    this.$emit(event.body, {
      id: event.body.stringCommentId || event.ts || new Date().getTime(),
      summary: `New comment or issue in project: ${event.body.name}`,
      ts: Date.parse(event.body.ts) || new Date().getTime(),
    });
  },
};
