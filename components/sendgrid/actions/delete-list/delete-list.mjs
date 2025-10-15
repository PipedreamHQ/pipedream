import common from "../common/common.mjs";

export default {
  ...common,
  key: "sendgrid-delete-list",
  name: "Delete List",
  description: "Allows you to delete a specific contact list. [See the docs here](https://docs.sendgrid.com/api-reference/lists/delete-a-list)",
  version: "0.0.6",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    listId: {
      propDefinition: [
        common.props.sendgrid,
        "listIds",
      ],
      type: "string",
      label: "Contact List",
      description: "Select the list from which you'd like to remove the contact, or reference a list ID manually",
    },
    deleteContacts: {
      propDefinition: [
        common.props.sendgrid,
        "deleteAll",
      ],
      label: "Delete Contacts?",
      description: "Indicates that all contacts on the list are also to be deleted",
    },
  },
  async run({ $ }) {
    this.deleteContacts = !!this.deleteContacts;
    const resp = await this.sendgrid.deleteList(this.listId, this.deleteContacts);
    $.export("$summary", `Successfully deleted list ${this.listId}.`);
    return resp;
  },
};
