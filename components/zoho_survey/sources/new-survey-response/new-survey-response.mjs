import common from "../common/base.mjs";
import decode from "html-entities-decoder";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "zoho_survey-new-survey-response",
  name: "New Survey Response (Instant)",
  description: "Emit new event when a new survey response is received in Zoho Surveys.",
  version: "0.0.5",
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
        id: `${response["RESPONSE_ID"].value}${ts}`,
        summary: `New Response ${response["RESPONSE_ID"].value}`,
        ts,
      };
    },
    collectFieldLabels(obj) {
      const labels = {};
      function recursiveSearch(obj, primaryLabel) {
        if (Array.isArray(obj)) {
          obj.forEach((question) => recursiveSearch(question, primaryLabel));
        }
        if ("variables" in obj) {
          recursiveSearch(obj.variables, `${primaryLabel
            ? primaryLabel + " - "
            : ""}${obj.label
            ? obj.label
            : ""}`);
        }
        if ("label" in obj && "key" in obj) {
          labels[obj.key] = `${primaryLabel
            ? primaryLabel + " - "
            : ""}${obj.label}`;
        }
      }
      recursiveSearch(obj);
      return labels;
    },
    formatValue(value) {
      return typeof value === "string"
        ? decode(value)
        : Array.isArray(value)
          ? value.map((v) => v
            ? decode(v)
            : "")
          : "";
    },
    async formatResponse(body) {
      const { variables } = await this.zohoSurvey.listSurveyFields({
        portalId: this.portalId,
        groupId: this.groupId,
        surveyId: this.surveyId,
      });
      const questions = variables.flatMap((v) => v.variables);
      const labels = this.collectFieldLabels(questions);
      const response = {};
      for (const [
        key,
        value,
      ] of Object.entries(body)) {
        response[key] = labels[key]
          ? {
            label: decode(labels[key]),
            value: this.formatValue(value),
          }
          : this.formatValue(value);
      }
      for (const [
        key,
        value,
      ] of Object.entries(labels)) {
        if (!response[key]) {
          response[key] = {
            label: decode(value),
            value: "",
          };
        }
      }
      return response;
    },
  },
  sampleEmit,
};
