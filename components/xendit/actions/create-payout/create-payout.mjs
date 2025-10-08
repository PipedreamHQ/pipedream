import { v7 as uuidV7 } from "uuid";
import { parseObject } from "../../common/utils.mjs";
import xendit from "../../xendit.app.mjs";

export default {
  key: "xendit-create-payout",
  name: "Create Payout",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Create a new payout on Xendit platform [See the documentation](https://developers.xendit.co/api-reference/#create-payout)",
  type: "action",
  props: {
    xendit,
    referenceId: {
      type: "string",
      label: "Reference ID",
      description: "A client defined payout identifier. This is the ID assigned to the payout on your system, such as a transaction or order ID. Does not need to be unique.",
    },
    channelCode: {
      type: "string",
      label: "Channel Code",
      description: "Channel code of destination bank, e-wallet or OTC channel. List of supported channels can be found [here](https://docs.xendit.co/xendisburse/channel-codes)",
    },
    accountHolderName: {
      type: "string",
      label: "Account Holder Name",
      description: "Name of account holder as per the bank or e-wallet's records. Needs to match the registered account name exactly.",
    },
    accountNumber: {
      type: "string",
      label: "Account Number",
      description: "Account number of destination. Mobile numbers for e-wallet accounts.",
    },
    accountType: {
      type: "string",
      label: "Account Type",
      description: "Account type of the destination for currencies and channels that supports proxy transfers (ie: Using mobile number as account number)",
      optional: true,
    },
    amount: {
      type: "string",
      label: "Amount",
      description: "Amount to be sent to the destination account. Should be a multiple of the minimum increment for the selected channel.",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description to send with the payout. The recipient may see this e.g., in their bank statement (if supported) or in email receipts we send on your behalf.",
      optional: true,
    },
    currency: {
      type: "string",
      label: "Currency",
      description: "ISO 4217 Currency Code.",
      optional: true,
    },
    emailTo: {
      type: "string[]",
      label: "Email To",
      description: "A list of email addresses to receive the payout details upon successful payout. **Maximum of three email addresses**.",
      optional: true,
    },
    emailCc: {
      type: "string[]",
      label: "Email Cc",
      description: "A list of email addresses to receive the payout details upon successful payout. **Maximum of three email addresses**.",
      optional: true,
    },
    emailBcc: {
      type: "string[]",
      label: "Email Bcc",
      description: "A list of email addresses to receive a hidden copy of the payout details upon successful payout. **Maximum of three email addresses**.",
      optional: true,
    },
    metadata: {
      type: "object",
      label: "Metadata",
      description: "A list of objects of metadata key-value pairs. The key must be a string and the value can be a string or number.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.xendit.createPayout({
      $,
      headers: {
        "idempotency-key": uuidV7(),
      },
      data: {
        reference_id: this.referenceId,
        channel_code: this.channelCode,
        channel_properties: {
          account_holder_name: this.accountHolderName,
          account_number: this.accountNumber,
          account_type: this.accountType,
        },
        amount: parseFloat(this.amount),
        description: this.description,
        currency: this.currency,
        receipt_notification: {
          email_to: this.emailTo,
          email_cc: this.emailCc,
          email_bcc: this.emailBcc,
        },
        metadata: parseObject(this.metadata),
      },
    });

    $.export("$summary", `A new payout with ID: ${response.id} was successfully created!`);
    return response;
  },
};
