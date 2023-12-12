import zonkaFeedback from "../../zonka_feedback.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "zonka_feedback-new-survey-response",
  name: "New Survey Response",
  description: "Emit new event for each survey response. [See docs](https://apidocs.zonkafeedback.com/?version=latest#156e4f44-d620-4d70-87f9-9d24462c23a2)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    zonkaFeedback,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    surveyIds: {
      type: "string[]",
      propDefinition: [
        zonkaFeedback,
        "surveyId",
      ],
    },
  },
  methods: {
    isRelevant(event) {
      return this.surveyIds.includes(event.surveyId);
    },
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
        params: {
          page: page++,
        },
      });
      events.push(...responses);
      if (responses.length < 25) {
        break;
      }
    }

    for (const event of events) {
      this.isRelevant(event) && this.processEvent(event);
    }
  },
};
