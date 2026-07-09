import minform from "../../minform.app.mjs";

export default {
  key: "minform-new-submission-received",
  name: "New Submission Received",
  description: "Emit new event when a new form submission is received",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    minform,
    db: "$.service.db",
    http: "$.interface.http",
  },
  hooks: {
    async activate() {
      const response = await this.minform.createWebhook({
        data: {
          url: this.http.endpoint,
        },
      });
      this._setHookId(response.id);
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
        id: submission.submissionId,
        summary: `New submission received for form ${submission.formName}`,
        ts: Date.parse(submission.submittedAt),
      };
    },
  },
  async run(event) {
    const { body } = event;
    if (!body) {
      return;
    }
    const meta = this.generateMeta(body);
    this.$emit(body, meta);
  },
};
