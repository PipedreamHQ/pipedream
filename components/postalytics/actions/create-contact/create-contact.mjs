import common from "../common/base.mjs";

export default {
  ...common,
  key: "postalytics-create-contact",
  name: "Create Contact",
  description: "Creates a new contact in Postalytics. [See the documentation](https://postalytics.docs.apiary.io/#reference/contact-api/contact-list-collection/add-contact)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    listId: {
      propDefinition: [
        common.props.postalytics,
        "listId",
      ],
    },
  },
  methods: {
    getFn() {
      return this.postalytics.createContact;
    },
    getObject({ listId }, objToSend) {
      objToSend.data["contact_list_id"] = listId;
      return objToSend;
    },
    getSummary({
      firstName, lastName,
    }) {
      return `Successfully created contact with name: ${firstName} ${lastName}`;
    },
  },
};
