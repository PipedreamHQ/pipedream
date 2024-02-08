import formpress from "../../formpress.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "formpress-new-submission-instant",
  name: "New Submission (Instant)",
  description: "Emit new event when there is a new submission. [See the documentation](https://formpress.org/blog-details/030-how-to-use-api-key-with-formpress)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    formpress,
    db: "$.service.db",
    http: "$.interface.http",
    formId: {
      propDefinition: [
        formpress,
        "formId",
      ],
    },
  },
  hooks: {
    async activate() {
      const { webhookId } = await this.formpress.createWebhook({
        formId: this.formId,
        data: {
          webhookUrl: this.http.endpoint,
        },
      });
      this._setHookId(webhookId);
    },
    async deactivate() {
      const hookId = this._getHookId();
      if (hookId) {
        await this.formpress.deleteWebhook({
          formId: this.formId,
          data: {
            webhookId: hookId,
          },
        });
      }
    },
  },
  methods: {
    _getHookId() {
      return this.db.get("hookId");
    },
    _setHookId(hookId) {
      this.db.set("hookId", hookId);
    },
  },
  async run({ body }) {
    const { metadata } = body;
    this.$emit(body, {
      id: metadata.submissionId,
      summary: `New submission: ${metadata.submissionId}`,
      ts: Date.parse(metadata.submissionDate),
    });
  },
  sampleEmit,
};
