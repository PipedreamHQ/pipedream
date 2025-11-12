import common from "../common/base.mjs";

export default {
  ...common,
  key: "acymailing-new-unsubscribed-user",
  name: "New Unsubscribed User",
  description: "Emit new event when a user unsubscribes from the specified mailing list.",
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
    getSummary({ email }) {
      return `User ${email} unsubscribed`;
    },
    getParams() {
      return {
        "listIds[]": this.listIds,
      };
    },
    getFn() {
      return this.acymailing.listUnsubscribedUsersFromLists;
    },
    getDateField() {
      return "unsubscribe_date";
    },
  },
};
