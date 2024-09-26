import common from "../create-contact/create-contact.mjs";

export default {
  ...common,
  key: "_1crm-update-contact",
  name: "Update Contact",
  description: "Modifies an existing contact within the 1CRM system. [See the documentation](https://demo.1crmcloud.com/api.php#endpoint_dataRecord_patch)",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    contactId: {
      propDefinition: [
        common.props._1crm,
        "recordId",
        () => ({
          model: "Contact",
        }),
      ],
    },
  },
  methods: {
    ...common.methods,
    getMethod() {
      return "update";
    },
    getUpdateId() {
      return this.contactId;
    },
    getSummary() {
      return  `Successfully updated contact with ID ${this.contactId}`;
    },
  },
};
