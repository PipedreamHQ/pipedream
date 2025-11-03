import common from "../common/base.mjs";

export default {
  ...common,
  key: "unisender-unsubscribe-contact",
  name: "Unsubscribe Contact",
  description: "This method unsubscribes the contact email or phone number from one or several lists.  [See the docs here](https://www.unisender.com/ru/support/api/contacts/unsubscribe/)",
  version: "0.0.4",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    contactType: {
      propDefinition: [
        common.props.unisender,
        "contactType",
      ],
    },
    contact: {
      propDefinition: [
        common.props.unisender,
        "contact",
      ],
    },
    lists: {
      propDefinition: [
        common.props.unisender,
        "lists",
      ],
      optional: true,
    },
  },
  methods: {
    async processEvent($) {
      const {
        lists,
        contactType,
        contact,
      } = this;
      return this.unisender.unsubscribeContact({
        $,
        params: {
          "list_ids": lists?.join(","),
          "contact_type": contactType,
          "contact": contact,
        },
      });
    },
    getSummary() {
      return `Contact with ${this.contactType} ${this.contact} Successfully unsubscribed!`;
    },
  },
};
