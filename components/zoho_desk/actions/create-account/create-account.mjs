import zohoDesk from "../../zoho_desk.app.mjs";

export default {
  key: "zoho_desk-create-account",
  name: "Create Account",
  description: "Creates an account in your help desk portal. [See the docs here](https://desk.zoho.com/DeskAPIDocument#Accounts#Accounts_CreateAccount)",
  type: "action",
  version: "0.0.6",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    zohoDesk,
    orgId: {
      propDefinition: [
        zohoDesk,
        "orgId",
      ],
    },
    accountName: {
      type: "string",
      label: "Account Name",
      description: "Name of the account",
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email ID of the account",
      optional: true,
    },
    website: {
      type: "string",
      label: "Website",
      description: "Website of the account",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Phone number of the account",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      orgId,
      accountName,
      email,
      website,
      phone,
    } = this;

    const response = await this.zohoDesk.createAccount({
      headers: {
        orgId,
      },
      data: {
        accountName,
        email,
        website,
        phone,
      },
    });

    $.export("$summary", `Successfully created a new account with ID ${response.id}`);

    return response;
  },
};
