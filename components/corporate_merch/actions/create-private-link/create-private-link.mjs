import corporateMerch from "../../corporate_merch.app.mjs";

export default {
  key: "corporate_merch-create-private-link",
  name: "Create Private Link",
  description: "Create a unique, trackable redemption URL for a recipient on a private redeem page. [See the documentation](https://corporatemerch.readme.io/reference/retrieve-a-single-link)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    corporateMerch,
    redeemPageId: {
      type: "string",
      label: "Redeem Page ID",
      description: "The ID of the private redeem page to generate a link for. Use the **List Redeem Pages** action to retrieve available redeem pages and their IDs.",
    },
    email: {
      type: "string",
      label: "Email",
      description: "Recipient's email address. Used as a unique identifier and delivery contact.",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "Recipient's first name.",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Recipient's last name.",
      optional: true,
    },
    sendEmail: {
      type: "boolean",
      label: "Send Email",
      description: "Set to `true` to trigger an automated delivery email to the recipient. Defaults to `false`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.corporateMerch.createPrivateLink({
      $,
      redeemPageId: this.redeemPageId,
      data: {
        email: this.email,
        first_name: this.firstName,
        last_name: this.lastName,
        send_email: this.sendEmail,
      },
    });
    $.export("$summary", `Successfully created private link for ${this.email}`);
    return response;
  },
};
