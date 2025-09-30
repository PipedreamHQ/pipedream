import common from "../common/common.mjs";

export default {
  ...common,
  key: "sendgrid-add-email-to-global-suppression",
  name: "Add Email to Global Suppression",
  description: "Allows you to add one or more email addresses to the global suppressions group. [See the docs here](https://sendgrid.api-docs.io/v3.0/suppressions-global-suppressions/add-recipient-addresses-to-the-global-suppression-group)",
  version: "0.0.6",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    recipientEmails: {
      type: "string[]",
      label: "Recipient Emails",
      description: "An array of email addresses to be added to the global suppressions group. Example `[\"email1@example.com\",\"email2@example.com\"]`",
    },
  },
  async run({ $ }) {
    const resp = await this.sendgrid.addEmailToGlobalSuppression(this.recipientEmails);
    $.export("$summary", "Successfully added emails to global suppressions group");
    return resp;
  },
};
