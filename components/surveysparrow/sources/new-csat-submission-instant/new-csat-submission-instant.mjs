import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "surveysparrow-new-csat-submission-instant",
  name: "New CSAT Submission (Instant)",
  description: "Emit new event when a customer satisfaction (CSAT) survey receives a new submission.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    survey: {
      propDefinition: [
        common.props.surveySparrow,
        "survey",
        () => ({
          surveyType: "CSAT",
        }),
      ],
    },
  },
  sampleEmit,
};
