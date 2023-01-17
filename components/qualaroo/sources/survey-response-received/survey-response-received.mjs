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
};
