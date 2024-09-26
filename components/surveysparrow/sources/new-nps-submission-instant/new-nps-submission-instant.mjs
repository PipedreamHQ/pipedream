import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "surveysparrow-new-nps-submission-instant",
  name: "New NPS Submission (Instant)",
  description: "Emit new event when a net promoter score (NPS) survey receives a new submission.",
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
          surveyType: "NPS",
        }),
      ],
    },
  },
  sampleEmit,
};
