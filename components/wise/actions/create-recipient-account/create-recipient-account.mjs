import wise from "../../wise.app.mjs";

export default {
  key: "wise-create-recipient-account",
  name: "Create Recipient Account",
  description: "Get a specific recipient account. [See docs here](https://api-docs.wise.com/api-reference/balance#get)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    wise,
    currency: {
      propDefinition: [
        wise,
        "currency",
      ],
    },
    profileId: {
      propDefinition: [
        wise,
        "profileId",
      ],
    },
    accountHolderName: {
      type: "string",
      label: "Account Holder Name",
      description: "Recipient full name.",
    },
    ownedByCustomer: {
      type: "boolean",
      label: "Owned By Customer",
      description: "Whether this account is owned by the sending user.",
      default: false,
    },
    legalType: {
      type: "string",
      label: "Legal Type",
      description: "Recipient legal type: PRIVATE or BUSINESS.",
      options: [
        "PRIVATE",
        "BUSINESS",
      ],
    },
    sortCode: {
      type: "string",
      label: "Sort Code",
      description: "Recipient bank sort code (GBP example).",
    },
    accountNumber: {
      type: "string",
      label: "Account Number",
      description: "Recipient bank account no (GBP example).",
    },
  },
  async run({ $ }) {
    const response = await this.wise.createAccount({
      $,
      data: {
        currency: this.currency,
        type: "sort_code",
        profileId: this.profileId,
        accountHolderName: this.accountHolderName,
        ownedByCustomer: this.ownedByCustomer,
        details: {
          legalType: this.legalType,
          sortCode: this.sortCode,
          accountNumber: this.accountNumber,
        },
      },
    });

    $.export("$summary", `Successfully created an account with ID: ${response.id}!`);
    return response;
  },
};
