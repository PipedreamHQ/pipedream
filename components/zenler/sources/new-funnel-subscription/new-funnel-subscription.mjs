import zenler from "../../zenler.app.mjs";

export default {
  key: "zenler-new-funnel-subscription",
  name: "New Funnel Subscription",
  description: "Emit new event when a funnel is created. [See the docs here](https://www.newzenler.com/api/documentation/public/api-doc.html#0052da8d-ca30-b23b-48b3-5cbdce72547e)",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    zenler,
  },
  async run() {},
};
