import base from "../common/base.mjs";

export default {
  ...base,
  key: "qualaroo-survey-response-received",
  name: "New Survey Response Received",
  description: "Emit new event when a survey response is received.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...base.props,
    survey: {
      propDefinition: [
        base.props.qualaroo,
        "survey",
      ],
    },
  },
  methods: {
    ...base.methods,
    getListingFunctionOpts() {
      return {
        fn: this.qualaroo.listSurveyResponses,
        opts: {
          survey: this.survey,
        },
      };
    },
    getMeta(surveyResponse) {
      return {
        id: surveyResponse.id,
        summary: `New response received for: ${surveyResponse.nudge_name}`,
        ts: new Date(surveyResponse.time),
      };
    },
  },
};
