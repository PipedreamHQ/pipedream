import app from "../../ortto.app.mjs";

export default {
  key: "ortto-get-people-subscription-status",
  name: "Get people subscription status",
  description: "Retrieves subscription statuses from one or more person records in Ortto’s customer data platform (CDP). [See the docs](https://help.ortto.com/developer/latest/api-reference/person/subscriptions.html).",
  type: "action",
  version: "0.0.1",
  props: {
    app,
  },
  async run() {},
};
