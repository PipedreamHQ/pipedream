import common from "../common/common.mjs";

export default {
  ...common,
  key: "campayn-new-contact-created",
  name: "New Contact Created",
  description: "Emit new events when a new contact is created. [See the docs](https://github.com/nebojsac/Campayn-API/blob/master/endpoints/contacts.md#get-contacts)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    listId: {
      propDefinition: [
        common.props.campayn,
        "listId",
      ],
    },
  },
  methods: {
    ...common.methods,
    async getResources() {
      return this.campayn.listContacts(this.listId);
    },
    generateMeta(contact) {
      return {
        id: contact.id,
        summary: contact.email,
        ts: Date.now(),
      };
    },
  },
};
