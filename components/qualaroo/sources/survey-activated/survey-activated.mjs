import base from "../common/base.mjs";

export default {
  ...base,
  key: "qualaroo-survey-activated",
  name: "Survey Activated",
  description: "Emit new event when a survey is activated. [See docs here.]()",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
};
