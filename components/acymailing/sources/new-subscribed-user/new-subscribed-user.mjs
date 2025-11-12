import common from "../common/base.mjs";

export default {
  ...common,
  key: "acymailing-new-subscribed-user",
  name: "New Subscribed User",
  description: "Emit new event when a user subscribes to a specified list.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    listIds: {
      propDefinition: [
        common.props.acymailing,
        "listIds",
      ],
    },
  },
  methods: {
    ...common.methods,
    getSummary({
      email, name,
    }) {
      return `New Subscriber: ${name} (${email})`;
    },
    getParams() {
      return {
        "listIds[]": this.listIds,
      };
    },
    getFn() {
      return this.acymailing.listSubscribersFromLists;
    },
    getDateField() {
      return "subscription_date";
    },
  },
};
