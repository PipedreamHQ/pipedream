import common from "../common/polling.mjs";

export default {
  ...common,
  key: "yay_com-new-contact-added",
  name: "New Contact Added",
  description: "Emit new event when a contact is added to a phone book. [See the documentation](https://www.yay.com/voip/api-docs/phone-books/phone-book-contact/)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    phoneBookId: {
      propDefinition: [
        common.props.yayCom,
        "phoneBookId",
      ],
    },
  },
  methods: {
    ...common.methods,
    generateMeta(contact) {
      const name = this.getItemId(contact);
      return {
        id: name,
        summary: `New Contact: ${name}`,
        ts: Date.now(),
      };
    },
    getItemId(contact) {
      let name = `${contact.first_name} ${contact.last_name}`;
      if (!name.trim()) {
        name = contact.company_name;
      }
      return name;
    },
    async getItems() {
      const { phoneBookId } = this;
      const contacts = await this.yayCom.listPhoneBookContacts({
        phoneBookId,
        params: {
          sort: "id",
          limit: 100,
          uuid: phoneBookId,
        },
      });
      return contacts || [];
    },
  },
};
