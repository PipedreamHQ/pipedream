const common = require("../common");

module.exports = {
  ...common,
  key: "sendgrid-delete-bounces",
  name: "Delete Bounces",
  description: "Allows you to delete all emails on your bounces list.",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    deleteAll: {
      type: "boolean",
      label: "Delete All",
      description:
        "This parameter allows you to delete every email in your bounce list. This can not be used with the `emails` parameter.",
      default: false,
    },
    emails: {
      type: "string[]",
      label: "Emails",
      description:
        "A string array of emails to delete from your bounce list at the same time. This can not be used with the `deleteAll` parameter. Example:  `[\"email1@example.com\",\"email2@example.com\"]`",
      optional: true,
    },
  },
  methods: {
    ...common.methods,
  },
  async run() {
    const deleteAll = !!(this.convertEmptyStringToUndefined(this.deleteAll));
    if (this.deleteAll && this.emails) {
      throw new Error(
        "Must provide only one of `deleteAll` or `emails` parameters.",
      );
    }
    return this.sendgrid.deleteBounces(deleteAll, this.emails);
  },
};
