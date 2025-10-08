import common from "../common/common.mjs";

export default {
  ...common,
  key: "sendgrid-remove-contact-from-list",
  name: "Remove Contact From List",
  description: "Allows you to remove contacts from a given list. [See the docs here](https://docs.sendgrid.com/api-reference/lists/remove-contacts-from-a-list)",
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
      optional: false,
    },
    contactIds: {
      propDefinition: [
        common.props.sendgrid,
        "contactIds",
      ],
      description: "String array of contact ids to be removed from the list.",
    },
    contactEmails: {
      propDefinition: [
        common.props.sendgrid,
        "contactEmail",
      ],
      type: "string[]",
      label: "Contact Emails",
      description: "Array of email addresses to be removed from the list.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      listId,
      contactIds = [],
      contactEmails = [],
    } = this;
    for (const email of contactEmails) {
      const { result } = await this.sendgrid.searchContacts(`email like '${email}'`);
      const id = result[0]?.id;
      if (!contactIds.includes(id)) {
        contactIds.push(id);
      }
    }
    const resp = await this.sendgrid.removeContactFromList(listId, contactIds);
    $.export("$summary", `Successfully removed ${contactIds.length} contact(s) from list.`);
    return resp;
  },
};
