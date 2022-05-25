import common from "../common.mjs";

export default {
  ...common,
  key: "sendgrid-delete-contacts",
  name: "Delete Contacts",
  description: "Allows you to delete one or more contacts. [See the docs here](https://docs.sendgrid.com/api-reference/contacts/delete-contacts)",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    deleteAllContacts: {
      propDefinition: [
        common.props.sendgrid,
        "deleteAll",
      ],
      label: "Delete All Contacts?",
      description: "This parameter allows you to delete all of your contacts. This can not be used with the `ids` parameter.",
    },
    ids: {
      propDefinition: [
        common.props.sendgrid,
        "contactIds",
      ],
    },
  },
  async run({ $ }) {
    if (this.deleteAllContacts && this.ids) {
      throw new Error("Must provide only one of `deleteAllContacts` or `ids` parameters.");
    }
    const resp = await this.sendgrid.deleteContacts(this.deleteAllContacts, this.ids);
    $.export("$summary", "Successfully deleted contacts");
    return resp;
  },
};
