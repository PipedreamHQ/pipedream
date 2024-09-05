import fillout from "../../fillout.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "fillout-new-submission-instant",
  name: "New Submission (Instant)",
  description: "Emit new event when a form receives a new submission.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    fillout,
    http: {
      type: "$.interface.http",
      customResponse: false,
    },
    db: "$.service.db",
    formId: {
      propDefinition: [
        fillout,
        "formId",
      ],
    },
  },
  hooks: {
    async activate() {
      const data = await this.fillout.createWebhook({
        data: {
          formId: this.formId,
          url: this.http.endpoint,
        },
      });
      this.db.set("webhookId", data.id);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      if (webhookId) {
        await this.fillout.deleteWebhook({
          data: {
            webhookId,
          },
        });
      }
    },
  },
  async run({ body }) {
    this.$emit(body, {
      id: body.submission.submissionId,
      summary: `New submission from form ${body.submission.submissionId}`,
      ts: body.submission.submissionTime,
    });
  },
  sampleEmit,
};
