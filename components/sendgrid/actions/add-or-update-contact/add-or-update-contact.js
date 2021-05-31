const sendgrid = require("../../sendgrid.app");

module.exports = {
  key: "sendgrid-add-or-update-contacts",
  name: "Add Or Update Contacts",
  description: "Adds or updates contacts.",
  version: "0.0.10",
  type: "action",
  props: {
    sendgrid,
    listIds: {
      type: "string",
      label: "List Ids",
      description:
        "A JSON-based array of List ID strings that this contact(s) will be added to. Example:  `[\"49eeb4d9-0065-4f6a-a7d8-dfd039b77e0f\",\"89876b28-a90e-41d1-b73b-e4a6ce2354ba\"]`",
      optional: true,
    },
    contacts: {
      type: "string",
      label: "Contacts",
      description:
        "A JSON-based array of one or more contacts objects that you intend to upsert. The `email` field is required for each Contact. Example `[{\"email\":\"email1@example.com\",\"first_name\":\"Example 1\"},{\"email\":\"email2@example.com\",\"first_name\":\"Example 2\"}]`",
    },
  },
  async run() {
    if (!this.contacts) {
      throw new Error("Must provide contacts parameter.");
    }
    const listIds = this.listIds ? JSON.parse(this.listIds) : null;
    const contacts = JSON.parse(this.contacts);
    return await this.sendgrid.addOrUpdateContacts({
      list_ids: listIds,
      contacts,
    });
  },
};
