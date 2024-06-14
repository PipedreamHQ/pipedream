import common from "../common/base.mjs";

export default {
  ...common,
  key: "acymailing-new-unsubscribed-user",
  name: "New Unsubscribed User",
  description: "Emit new event when a user unsubscribes from the specified mailing list.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    listId: {
      propDefinition: [
        common.props.acymailing,
        "listIds",
      ],
      type: "integer",
      label: "List Id",
    },
  },
  methods: {
    ...common.methods,
    getSummary({ email }) {
      return `User ${email} unsubscribed`;
    },
    getParams() {
      return {
        "listIds[]": this.listId,
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
