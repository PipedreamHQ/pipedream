import base from "../common/base-timer.mjs";
import baseComponent from "../form-published-instant/common-form-published-instant.mjs";

export default {
  ...base,
  key: "regfox-form-published",
  name: "New Form Published",
  description: "Emit new event when a form is succesfully published. [See docs here.](https://docs.webconnex.io/api/v2/#form-publish-event)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...base.methods,
    ...baseComponent.methods,
  },
};
