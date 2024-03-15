import surveysparrow from "../../surveysparrow.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "surveysparrow-new-nps-submission-instant",
  name: "New NPS Submission (Instant)",
  description: "Emit new event when a net promoter score (NPS) survey receives a new submission. [See the documentation](https://developers.surveysparrow.com/rest-apis)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    surveysparrow,
    surveyId: {
      propDefinition: [
        surveysparrow,
        "surveyId",
      ],
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  hooks: {
    async activate() {
      const { data: { id: hookId } } = await this.surveysparrow.createWebhook({
        data: {
          event: "response.completed",
          target_url: this.http.endpoint,
          survey_id: this.surveyId,
        },
      });
      this.db.set("hookId", hookId);
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
      id: event.body.response_id || event.body.responseId,
      summary: `New NPS Submission: ${event.body.response_id || event.body.responseId} for Survey ID ${this.surveyId}`,
      ts: Date.parse(event.body.submitted_at || event.body.createdAt),
    });
  },
};
