import base from "../common/base.mjs";

export default {
  ...base,
  key: "qualaroo-survey-created",
  name: "Survey Created",
  description: "Emit new event when a survey is created. [See docs here.]()",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
};
