import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "zoho_survey-new-survey-response",
  name: "New Survey Response (Instant)",
  description: "Emit new event when a new survey response is received in Zoho Surveys.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return "response_completed";
    },
    generateMeta(response) {
      const ts = Date.now();
      return {
        id: `${response["Response ID"]}${ts}`,
        summary: `New Response ${response["Response ID"]}`,
        ts,
      };
    },
    collectFieldLabels(obj) {
      const labels = {};
      function recursiveSearch(obj) {
        if (Array.isArray(obj)) {
          obj.forEach((item) => recursiveSearch(item));
        } else if (obj && typeof obj === "object") {
          if ("label" in obj) {
            labels[obj.key] = obj.label;
          }
          Object.values(obj).forEach((value) => recursiveSearch(value));
        }
      }
      recursiveSearch(obj);
      return labels;
    },
    async formatResponse(body) {
      const { variables } = await this.zohoSurvey.listSurveyFields({
        portalId: this.portalId,
        groupId: this.groupId,
        surveyId: this.surveyId,
      });
      const labels = this.collectFieldLabels(variables);
      const response = {};
      for (const [
        key,
        value,
      ] of Object.entries(body)) {
        response[labels[key]] = value;
      }
      for (const label of Object.values(labels)) {
        if (!response[label]) {
          response[label] = "";
        }
      }
      return response;
    },
  },
  sampleEmit,
};
