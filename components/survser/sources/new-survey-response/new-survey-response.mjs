import survser from "../../survser.app.mjs";
import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";

export default {
  key: "survser-new-survey-response",
  name: "New Survey Response",
  description: "Emits a new event when a new survey response is received. [See the documentation](https://docs.survser.com/docs/api)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    survser,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  hooks: {
    async deploy() {
      const surveys = await this.survser.getSurveys();
      for (const survey of surveys) {
        const surveyId = survey.id;
        const responses = await this.survser.getSurveyResponses(surveyId);
        for (const response of responses.slice(0, 50).reverse()) {
          this.$emit(response, {
            id: response.id,
            summary: `New response in survey ${surveyId}`,
            ts: Date.parse(response.createdAt),
          });
        }
      }
    },
  },
  async run() {
    const surveys = await this.survser.getSurveys();
    for (const survey of surveys) {
      const surveyId = survey.id;
      const prevResponses = this.db.get("prevResponses") || [];
      const currentResponses = await this.survser.getSurveyResponses(surveyId);
      for (const response of currentResponses) {
        if (!prevResponses.includes(response.id)) {
          this.$emit(response, {
            id: response.id,
            summary: `New response in survey ${surveyId}`,
            ts: Date.parse(response.createdAt),
          });
        }
      }
      this.db.set("prevResponses", currentResponses.map((response) => response.id));
    }
  },
};
