import common from "../common/base.mjs";

export default {
  ...common,
  key: "vbout-add-contact-to-list",
  name: "Add Contact To List",
  description: "This action move a contact to a specific list. [See the docs here](https://developers.vbout.com/docs#emailmarketing_movecontact)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
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
      description: "Select the list where the contact will be moved",
    },
  },
  methods: {
    async processEvent($) {
      const {
        listFrom,
        contact,
        list,
      } = this;
      return this.vbout.moveContact({
        $,
        params: {
          id: contact.value,
          listid: list.value,
          sourceid: listFrom.value,
        },
      });
    },
    getSummary() {
      return `Contact ${this.contact.label} Successfully moved to list ${this.list.label}!`;
    },
  },
};
