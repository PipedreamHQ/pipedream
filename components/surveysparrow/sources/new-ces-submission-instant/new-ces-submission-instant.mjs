import surveysparrow from "../../surveysparrow.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "surveysparrow-new-ces-submission-instant",
  name: "New CES Submission (Instant)",
  description: "Emit new event when a customer effort score (CES) survey receives a new submission.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    surveysparrow,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    surveyId: {
      propDefinition: [
        surveysparrow,
        "surveyId",
      ],
    },
  },
  hooks: {
    async deploy() {
      // Deploy hook to register and save the webhook
      const hookUrl = `${this.http.endpoint}`;
      const webhook = await this.surveysparrow.createWebhook({
        data: {
          event: "new_response",
          target_url: hookUrl,
          survey_id: this.surveyId,
        },
      });
      this.db.set("webhookId", webhook.id);
    },
    async deactivate() {
      // Deactivate hook to remove the webhook
      const webhookId = this.db.get("webhookId");
      await this.surveysparrow.deleteWebhook({
        hookId: webhookId,
      });
    },
  },
  async run(event) {
    // Emit the new CES submission event
    this.$emit(event.body, {
      id: event.body.response.id,
      summary: `New CES submission: ${event.body.response.id}`,
      ts: Date.parse(event.body.response.submitted_at),
    });
  },
};
