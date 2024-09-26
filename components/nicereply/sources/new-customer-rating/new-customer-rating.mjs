import common from "../common/common.mjs";

export default {
  ...common,
  name: "New Customer Rating",
  version: "0.0.2",
  key: "nicereply-new-customer-rating",
  description: "Emit new event on each new customer rating.",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    customerId: {
      propDefinition: [
        common.props.nicereply,
        "customerId",
      ],
    },
  },
  methods: {
    ...common.methods,
    emitEvent(data) {
      this.$emit(data, {
        id: data.id,
        summary: `New customer rating with id ${data.id}`,
        ts: Date.parse(data.created_at),
      });
    },
    getRatings() {
      return this.nicereply.getCustomerRatings;
    },
    getRequestExtraArgs() {
      return {
        customerId: this.customerId,
      };
    },
  },
};
