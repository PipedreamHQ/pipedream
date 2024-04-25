import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "surveysparrow-new-ces-submission-instant",
  name: "New CES Submission (Instant)",
  description: "Emit new event when a customer effort score (CES) survey receives a new submission.",
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
          surveyType: "CES",
        }),
      ],
    },
  },
  sampleEmit,
};
