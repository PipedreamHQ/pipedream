import common from "../common/base.mjs";
import decode from "html-entities-decoder";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "zoho_survey-new-survey-response",
  name: "New Survey Response (Instant)",
  description: "Emit new event when a new survey response is received in Zoho Surveys.",
  version: "0.0.3",
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
        id: `${response["RESPONSE_ID"]}${ts}`,
        summary: `New Response ${response["RESPONSE_ID"]}`,
        ts,
      };
    },
    collectFieldLabels(obj) {
      const labels = {};
      function recursiveSearch(obj) {
        if (Array.isArray(obj)) {
          obj.forEach((item) => recursiveSearch(item));
        } else if (obj && typeof obj === "object") {
          if ("label" in obj && "key" in obj) {
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
      const questions = (variables.find(({ label }) => label === "Questions"))?.variables;
      const respondentVariables = (variables.find(({ label }) => label == "Respondent Variables"))?.variables;
      const labels = this.collectFieldLabels([
        ...questions,
        ...respondentVariables,
      ]);
      const response = {};
      for (const [
        key,
        value,
      ] of Object.entries(body)) {
        response[key] = labels[key]
          ? {
            label: decode(labels[key]),
            value: decode(value),
          }
          : decode(value);
      }
      for (const [
        key,
        value,
      ] of Object.entries(labels)) {
        if (!response[key]) {
          response[key] = {
            label: decode(value),
          };
        }
      }
      return response;
    },
  },
  sampleEmit,
};
