import common from "../common/common.mjs";

export default {
  ...common,
  name: "New Survey Rating",
  version: "0.0.1",
  key: "nicereply-new-survey-rating",
  description: "Emit new event on each new survey rating.",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    surveyId: {
      propDefinition: [
        common.props.nicereply,
        "surveyId",
      ],
    },
  },
  methods: {
    ...common.methods,
    emitEvent(data) {
      this.$emit(data, {
        id: data.id,
        summary: `New survey rating with id ${data.id}`,
        ts: Date.parse(data.created_at),
      });
    },
    getRatings() {
      return this.nicereply.getSurveyRatings;
    },
    getRequestExtraArgs() {
      return {
        surveyId: this.surveyId,
      };
    },
  },
};
