import common from "../common/base.mjs";

export default {
  ...common,
  key: "vbout-unsubscribe-contact",
  name: "Unsubscribe Contact",
  description: "This action unsubscribes a specific contact from a list. [See the docs here](https://developers.vbout.com/docs#emailmarketing_editcontact)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    list: {
      propDefinition: [
        common.props.vbout,
        "list",
      ],
    },
    contact: {
      propDefinition: [
        common.props.vbout,
        "contact",
        (c) => ({
          listId: c.list.value,
        }),
      ],
      description: "Select the contact that will be unsubscribed.",
    },
  },
  methods: {
    async processEvent($) {
      const { contact } = this;
      return this.vbout.updateContact({
        $,
        params: {
          id: contact.value,
          status: 2,
        },
      });
    },
    getSummary() {
      return `Contact ${this.contact.label} Successfully unsubscribed!`;
    },
  },
};
