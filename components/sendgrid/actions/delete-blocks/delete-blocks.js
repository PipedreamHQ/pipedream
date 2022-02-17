const common = require("../common");

module.exports = {
  ...common,
  key: "sendgrid-delete-blocks",
  name: "Delete Blocks",
  description: "Allows you to delete all email addresses on your blocks list.",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    deleteAll: {
      type: "boolean",
      label: "Delete All",
      description:
        "Indicates if you want to delete all blocked email addresses. This can not be used with the `emails` parameter.",
      default: false,
    },
    emails: {
      type: "string[]",
      label: "Emails",
      description:
        "A string array of the specific blocked email addresses that you want to delete. This can not be used with the `deleteAll` parameter. Example: `[\"email1@example.com\",\"email2@example.com\"]`",
      optional: true,
    },
  },
  methods: {
    ...common.methods,
  },
  async run() {
    const deleteAll = !!(this.convertEmptyStringToUndefined(this.deleteAll));
    if (deleteAll && this.emails) {
      throw new Error(
        "Must provide only one of `deleteAll` or `emails` parameters.",
      );
    }
    return this.sendgrid.deleteBlocks(deleteAll, this.emails);
  },
};
