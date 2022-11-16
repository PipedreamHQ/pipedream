import common from "../common.mjs";

export default {
  ...common,
  key: "zenler-new-funnel-subscription",
  name: "New Funnel Subscription",
  description: "Emit new event when a funnel is created. [See the docs here](https://www.newzenler.com/api/documentation/public/api-doc.html#0052da8d-ca30-b23b-48b3-5cbdce72547e)",
  type: "source",
  version: "0.0.2",
  dedupe: "unique",
  props: {
    ...common.props,
    funnelId: {
      propDefinition: [
        common.props.zenler,
        "funnelId",
      ],
    },
  },
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.zenler.getFunnelSubscriptions;
    },
    getResourceFnArgs() {
      return {
        funnelId: this.funnelId,
      };
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        ts: Date.parse(resource.enrolled_on),
        summary: `Funnel Subscription ID ${resource.id}`,
      };
    },
  },
};
