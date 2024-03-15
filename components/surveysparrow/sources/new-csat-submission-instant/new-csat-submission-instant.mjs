import surveysparrow from "../../surveysparrow.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "surveysparrow-new-csat-submission-instant",
  name: "New CSAT Submission (Instant)",
  description: "Emit new event when a customer satisfaction (CSAT) survey receives a new submission.",
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
    async activate() {
      const { data } = await this.surveysparrow.createWebhook({
        data: {
          event: "survey_response.created",
          target_url: this.http.endpoint,
          survey_id: this.surveyId,
        },
      });
      this.db.set("hookId", data.id);
    },
    async deactivate() {
      const hookId = this.db.get("hookId");
      await this.surveysparrow.deleteWebhook({
        hookId,
      });
    },
  },
  async run(event) {
    this.$emit(event.body, {
      id: event.body.response.id,
      summary: `New CSAT submission for survey ID ${this.surveyId}`,
      ts: Date.parse(event.body.response.created_at),
    });
  },
};
