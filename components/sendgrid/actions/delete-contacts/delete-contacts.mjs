import common from "../common/common.mjs";

export default {
  ...common,
  key: "sendgrid-delete-contacts",
  name: "Delete Contacts",
  description: "Allows you to delete one or more contacts. [See the docs here](https://docs.sendgrid.com/api-reference/contacts/delete-contacts)",
  version: "0.0.6",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
    contactIds: {
      propDefinition: [
        common.props.sendgrid,
        "contactIds",
      ],
    },
    contactEmails: {
      propDefinition: [
        common.props.sendgrid,
        "contactEmail",
      ],
      type: "string[]",
      label: "Contact Emails",
      description: "Array of email addresses to be deleted.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      deleteAllContacts,
      contactIds = [],
      contactEmails = [],
    } = this;

    if (deleteAllContacts && (contactIds || contactEmails)) {
      throw new Error("If `deleteAllContacts` is selected, cannot select `contactIds` or `contactEmails`");
    }

    for (const email of contactEmails) {
      const { result } = await this.sendgrid.searchContacts(`email like '${email}'`);
      const id = result[0]?.id;
      if (!contactIds.includes(id)) {
        contactIds.push(id);
      }
    }
    const resp = await this.sendgrid.deleteContacts(deleteAllContacts, contactIds);
    $.export("$summary", `Successfully deleted ${contactIds.length} contact(s)`);
    return resp;
  },
};
