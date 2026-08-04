// x-pd-ai: optimized
import { ConfigurationError } from "@pipedream/platform";
import mercury from "../../mercury.app.mjs";
import { ELECTRONIC_ACCOUNT_TYPES } from "../../common/constants.mjs";

export default {
  key: "mercury-add-recipient",
  name: "Add Recipient",
  description: "Create a new Mercury payment recipient. For ACH recipients, provide accountNumber, routingNumber, electronicAccountType, and address (all required together for the ACH routing info). After creation, use **List Recipients** to confirm and retrieve the new recipient ID for **Send Payment**. Example: call with `recipientName=\"Acme Corp\"`, `emails=[\"billing@acme.com\"]`, `accountNumber=\"123456789\"`, `routingNumber=\"021000021\"`, `electronicAccountType=\"businessChecking\"`, and `address={\"address1\":\"123 Main St\",\"city\":\"New York\",\"region\":\"NY\",\"postalCode\":\"10001\",\"country\":\"US\"}` -> returns the created recipient `{ id: \"rec_1a2b...\", name: \"Acme Corp\", ... }`. [See the documentation](https://docs.mercury.com/reference/createrecipient)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    mercury,
    recipientName: {
      type: "string",
      label: "Recipient Name",
      description: "Recipient name (e.g. `Acme Corp`).",
    },
    emails: {
      type: "string[]",
      label: "Emails",
      description: "One or more recipient email addresses (e.g. `[\"billing@acme.com\"]`). Required by the API.",
    },
    accountNumber: {
      type: "string",
      label: "Account Number",
      description: "Bank account number for ACH routing (electronicRoutingInfo). Required together with routingNumber, electronicAccountType, and address to create an ACH recipient.",
      optional: true,
    },
    routingNumber: {
      type: "string",
      label: "Routing Number",
      description: "9-digit ABA routing number for ACH routing (e.g. `021000021`).",
      optional: true,
    },
    electronicAccountType: {
      type: "string",
      label: "Electronic Account Type",
      description: "ACH account type. One of `businessChecking`, `businessSavings`, `personalChecking`, `personalSavings`. NOTE: Mercury does not accept plain `checking`/`savings`.",
      options: ELECTRONIC_ACCOUNT_TYPES,
      optional: true,
    },
    address: {
      type: "object",
      label: "Address",
      description: "Recipient postal address object, required for ACH recipients. Example: `{\"address1\":\"123 Main St\",\"city\":\"New York\",\"region\":\"NY\",\"postalCode\":\"10001\",\"country\":\"US\"}`.",
      optional: true,
    },
    checkInfo: {
      type: "object",
      label: "Check Info",
      description: "Physical-check routing info object (for check recipients). Requires a mailing `address` for sending the check. Example: `{\"address\":{\"address1\":\"123 Main St\",\"city\":\"New York\",\"region\":\"NY\",\"postalCode\":\"10001\",\"country\":\"US\"}}`.",
      optional: true,
    },
    domesticWireRoutingInfo: {
      type: "object",
      label: "Domestic Wire Routing Info",
      description: "Domestic wire routing info object (for wire recipients). Requires `accountNumber`, `routingNumber`, and the recipient's legal `address`. Example: `{\"accountNumber\":\"123456789\",\"routingNumber\":\"021000021\",\"address\":{\"address1\":\"123 Main St\",\"city\":\"New York\",\"region\":\"NY\",\"postalCode\":\"10001\",\"country\":\"US\"}}`.",
      optional: true,
    },
    contactEmail: {
      type: "string",
      label: "Contact Email",
      description: "Optional primary contact email.",
      optional: true,
    },
    nickname: {
      type: "string",
      label: "Nickname",
      description: "Optional recipient nickname.",
      optional: true,
    },
  },
  async run({ $ }) {
    const achFields = [
      this.accountNumber,
      this.routingNumber,
      this.electronicAccountType,
      this.address,
    ];
    const providedAch = achFields.filter((v) => v !== undefined && v !== null && v !== "").length;
    if (providedAch > 0 && providedAch < achFields.length) {
      throw new ConfigurationError("ACH routing requires **Account Number**, **Routing Number**, **Electronic Account Type**, and **Address** together — provide all four or none.");
    }
    const electronicRoutingInfo = providedAch === achFields.length
      ? {
        accountNumber: this.accountNumber,
        routingNumber: this.routingNumber,
        electronicAccountType: this.electronicAccountType,
        address: this.address,
      }
      : undefined;

    const recipient = await this.mercury.createRecipient({
      $,
      data: {
        name: this.recipientName,
        emails: this.emails,
        electronicRoutingInfo,
        checkInfo: this.checkInfo,
        domesticWireRoutingInfo: this.domesticWireRoutingInfo,
        contactEmail: this.contactEmail,
        nickname: this.nickname,
      },
    });
    $.export("$summary", `Successfully created recipient ${recipient.id}: ${this.recipientName}`);
    return recipient;
  },
};
