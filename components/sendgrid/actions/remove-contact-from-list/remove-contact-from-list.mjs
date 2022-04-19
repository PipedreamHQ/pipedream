import common from "../common.mjs";

export default {
  ...common,
  key: "sendgrid-remove-contact-from-list",
  name: "Remove Contact From List",
  description: "Allows you to remove contacts from a given list.",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    id: {
      type: "string",
      label: "Id",
      description: "Unique Id of the List where the contact to remove off is located",
    },
    contactIds: {
      type: "string[]",
      label: "Contact Ids",
      description: "String array of contact ids to be removed from the list.",
    },
  },
  async run({ $ }) {
    const resp = await this.sendgrid.removeContactFromList(this.id, this.contactIds);
    $.export("$summary", `Successfully removed contact ${this.contactId} from list.`);
    return resp;
  },
};
