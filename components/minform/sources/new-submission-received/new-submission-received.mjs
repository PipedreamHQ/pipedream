import minform from "../../minform.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "minform-new-submission-received",
  name: "New Submission Received (Instant)",
  description: "Emit new event when a new form submission is received. [See the documentation](https://minform-pipedream-api-docs.solutionportal.workers.dev/webhooks/)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    minform,
    db: "$.service.db",
    http: "$.interface.http",
    formId: {
      propDefinition: [
        minform,
        "formId",
      ],
    },
  },
  hooks: {
    async activate() {
      const response = await this.minform.createWebhook({
        data: {
          formId: this.formId,
          targetUrl: this.http.endpoint,
        },
      });
      this._setHookId(response?.id);
    },
    async deactivate() {
      const hookId = this._getHookId();
      if (hookId) {
        await this.minform.deleteWebhook({
          params: {
            hook_id: hookId,
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
    generateMeta(submission) {
      return {
        id: submission.id,
        summary: `New submission received for form ${submission.form_name}`,
        ts: Date.parse(submission.created_at),
      };
    },
  },
  async run(event) {
    const { body } = event;
    if (!body?.length) {
      return;
    }
    const submission = body[0];
    const meta = this.generateMeta(submission);
    this.$emit(submission, meta);
  },
  sampleEmit,
};
