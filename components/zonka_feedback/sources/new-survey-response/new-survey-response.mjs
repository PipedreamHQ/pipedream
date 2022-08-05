import zonkaFeedback from "../../zonka_feedback.app.mjs";

export default {
  key: "zonka_feedback-new-survey-response",
  name: "New Survey Response",
  description: "Emit new event for each survey response. [See docs](https://apidocs.zonkafeedback.com/?version=latest#156e4f44-d620-4d70-87f9-9d24462c23a2)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    zonkaFeedback,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
    surveyId: {
      propDefinition: [
        zonkaFeedback,
        "surveyId",
      ],
    },
  },
  methods: {
    generateMeta(event) {
      const {
        receivedDate: ts,
        id,
        surveyName,
      } = event;
      return {
        id,
        summary: `New response for: ${surveyName}`,
        ts,
      };
    },
    processEvent(event) {
      const meta = this.generateMeta(event);
      this.$emit(event, meta);
    },
  },
  async run() {
    const events = [];
    let page = 1;

    while (true) {
      const responses = await this.zonkaFeedback.getSurveyResponses({
        surveyId: this.surveyId,
        page: page++,
      });
      events.push(...responses);
      if (responses.length < 25 || responses[0].id === events[events.length - 1].id) {
        break;
      }
    }

    for (const event of events) {
      this.processEvent(event);
    }
  },
};
