import common from "../common.mjs";

export default {
  ...common,
  key: "sendgrid-remove-contact-from-list",
  name: "Remove Contact From List",
  description: "Allows you to remove contacts from a given list. [See the docs here](https://docs.sendgrid.com/api-reference/lists/remove-contacts-from-a-list)",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    id: {
      propDefinition: [
        common.props.sendgrid,
        "listIds",
      ],
      type: "string",
      label: "Id",
      description: "Unique Id of the List where the contact to remove is located",
      optional: false,
    },
    contactIds: {
      propDefinition: [
        common.props.sendgrid,
        "contactIds",
      ],
      description: "String array of contact ids to be removed from the list.",
      optional: false,
    },
  },
  async run({ $ }) {
    const resp = await this.sendgrid.removeContactFromList(this.id, this.contactIds);
    $.export("$summary", `Successfully removed contact ${this.contactId} from list.`);
    return resp;
  },
};
