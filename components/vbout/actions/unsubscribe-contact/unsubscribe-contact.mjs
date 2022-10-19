import common from "../common/base.mjs";

export default {
  ...common,
  key: "vbout-unsubscribe-contact",
  name: "Unsubscribe Contact",
  description: "This action unsubscribes a specific contact from a list. [See the docs here](https://developers.vbout.com/docs#emailmarketing_editcontact)",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    list: {
      propDefinition: [
        common.props.vbout,
        "list",
      ],
      description: "Select the list where the contact will be unsubscribed",
    },
    contact: {
      propDefinition: [
        common.props.vbout,
        "contact",
        (c) => ({
          listId: c.list.value,
        }),
      ],
    },
  },
  methods: {
    async processEvent($) {
      const { contact } = this;
      return this.vbout.updateContact({
        $,
        id: contact.value,
        status: "Disactive",
      });
    },
    getSummary() {
      return `Contact ${this.contact.label} Successfully unsubscribed!`;
    },
  },
};
