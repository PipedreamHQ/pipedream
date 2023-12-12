import common from "../common/common.mjs";

export default {
  name: "New List Contact",
  key: "emailoctopus-new-list-contact",
  description: "Emit new event each time a contact is added to a list.",
  version: "0.0.4",
  type: "source",
  dedupe: "unique",
  ...common,
  props: {
    ...common.props,
    listId: {
      propDefinition: [
        common.props.app,
        "listId",
      ],
    },
  },
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.app.getContacts;
    },
    getResourceFnParams() {
      return {
        listId: this.listId,
      };
    },
    async getItem(item) {
      return await this.app.getContact({
        listId: this.listId,
        contactId: item.id,
      });
    },
    getMeta(item) {
      return {
        id: new Date().getTime(),
        summary: `New contact added - ${item.fields.FirstName} ${item.fields.LastName} (${item.email_address})`,
        ts: new Date(item.created_at).getTime(),
      };
    },
  },
};
