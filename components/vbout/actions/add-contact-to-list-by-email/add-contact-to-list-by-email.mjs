import common from "../common/base.mjs";

export default {
  ...common,
  key: "vbout-add-contact-to-list-by-email",
  name: "Add Contact To List By Email",
  description: "This action add a specific list to a contact. All emails having the same email text available in the provided list will be updated if exists [See the docs here](https://developers.vbout.com/docs#emailmarketing_synccontact)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    listFrom: {
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
          listId: c.listFrom.value,
        }),
      ],
    },
    list: {
      propDefinition: [
        common.props.vbout,
        "list",
      ],
      description: "Select the list where the contact will be added",
    },
  },
  methods: {
    async processEvent($) {
      const {
        contact,
        list,
      } = this;
      return this.vbout.syncContact({
        $,
        params: {
          email: contact.label,
          listid: list.value,
        },
      });
    },
    getSummary() {
      return `Contact ${this.contact.label} Successfully added to list ${this.list.label}!`;
    },
  },
};
