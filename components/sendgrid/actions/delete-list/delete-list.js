const sendgrid = require("../../sendgrid.app");

module.exports = {
  key: "sendgrid-delete-list",
  name: "Delete List",
  description: "Allows you to delete a specific list.",
  version: "0.0.8",
  type: "action",
  props: {
    sendgrid,
    id: {
      type: "string",
      label: "Id",
      description: "Unique Id of the List to be deleted.",
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
    deleteContacts: {
      type: "boolean",
      label: "Delete Contacts?",
      description:
        "Indicates that all contacts on the list are also to be deleted.",
      optional: true,
    },
  },
  async run() {
    if (!this.id) {
      throw new Error("Must provide id parameter.");
    }
    return await this.sendgrid.deleteList(this.id, this.deleteContacts);
  },
};
