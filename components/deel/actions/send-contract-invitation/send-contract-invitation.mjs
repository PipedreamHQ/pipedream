import app from "../../deel.app.mjs";

export default {
  key: "deel-send-contract-invitation",
  name: "Send Contract Invitation",
  description:
    "Send a contract invitation email to a worker for a specific Deel contract."
    + " Use this after creating a contract to notify the worker and prompt them to sign."
    + " Use **List Contracts** to find the contract ID."
    + " [See the documentation](https://developer.deel.com/api/reference/endpoints/contractor-hiring/create-contract-invitation)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    contractId: {
      propDefinition: [
        app,
        "contractId",
      ],
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email address to send the invitation to.",
    },
    locale: {
      type: "string",
      label: "Locale",
      description: "Language locale for the invitation email (e.g., `en`, `de`, `fr`). Defaults to `en`.",
      optional: true,
    },
    message: {
      type: "string",
      label: "Message",
      description: "Optional personal message to include in the invitation email.",
      optional: true,
    },
  },
  async run({ $ }) {
    const payload = {
      email: this.email,
    };
    if (this.locale) payload.locale = this.locale;
    if (this.message) payload.message = this.message;

    const response = await this.app.sendContractInvitation($, this.contractId, payload);

    $.export("$summary", `Sent contract invitation for contract ${this.contractId}`);
    return response;
  },
};
