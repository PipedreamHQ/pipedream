import opnform from "../../opnform.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "opnform-new-submission-instant",
  name: "New Submission Instant",
  description: "Emit new event when a form receives a submission.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    opnform,
    http: "$.interface.http",
    db: "$.service.db",
    workspaceId: {
      propDefinition: [
        opnform,
        "workspaceId",
      ],
    },
    formId: {
      propDefinition: [
        opnform,
        "formId",
        ({ workspaceId }) => ({
          workspaceId,
        }),
      ],
    },
  },
  hooks: {
    async activate() {
      await this.opnform.createWebhook({
        data: {
          hookUrl: this.http.endpoint,
          form_id: this.formId,
        },
      });
    },
    async deactivate() {
      await this.opnform.deleteWebhook({
        data: {
          hookUrl: this.http.endpoint,
          form_id: this.formId,
        },
      });
    },
  },
  async run({ body }) {
    const ts = Date.now();
    this.$emit(body, {
      id: `${body.form_slug}-${ts}`,
      summary: `New submission for "${body.form_title}"`,
      ts,
    });
  },
  sampleEmit,
};
