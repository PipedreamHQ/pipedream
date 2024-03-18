import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "surveysparrow-new-survey-response",
  name: "New Survey Response (Instant)",
  description: "Emit new event each time a the specified survey receives a response.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  sampleEmit,
};
