const sendgrid = require("../../sendgrid.app");

module.exports = {
  key: "sendgrid-remove-a-contact-from-a-list",
  name: "Remove A Contact From A List",
  description: "Allows you to remove contacts from a given list.",
  version: "0.0.3",
  type: "action",
  props: {
    sendgrid,
    id: {
      type: "string",
      label: "Id",
      description:
        "Unique Id of the List where the contact to remove off is located.",
      useQuery: true,
      async options() {
        const options = [];
        const lists = await this.sendgrid.getAllLists();
        for (const list of lists.result) {
          options.push({ label: list.name, value: list.id });
        }
        return options;
      },
    },
    contactIds: {
      type: "string",
      label: "Contact Ids",
      description:
        "Comma separated list of contact ids to be removed off the list.",
    },
  },
  async run() {
    if (!this.id || !this.contactIds) {
      throw new Error("Must provide id and contactIds parameters.");
    }
    return await this.sendgrid.removeContactFromList(this.id, this.contactIds);
  },
};
