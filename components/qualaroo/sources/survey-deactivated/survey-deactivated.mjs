import base from "../common/base.mjs";

export default {
  ...base,
  key: "qualaroo-survey-deactivated",
  name: "Survey Deactivated",
  description: "Emit new event when a survey is deactivated. [See docs here.]()",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
};
