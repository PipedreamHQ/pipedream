import docusign from "../../docusign.app.mjs";

export default {
  key: "docusign-create-recipient-view",
  name: "Create Recipient View",
  description: "Create an embedded signing URL for a recipient. The envelope recipient must have been created with a `clientUserId`, and Client User ID, Recipient Email, and Recipient Name must match that recipient. [See the documentation](https://developers.docusign.com/docs/esign-rest-api/reference/envelopes/envelopeviews/createrecipient/)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    docusign,
    account: {
      propDefinition: [
        docusign,
        "account",
      ],
    },
    envelopeId: {
      type: "string",
      label: "Envelope ID",
      description: "The ID of the envelope containing the embedded recipient.",
    },
    returnUrl: {
      type: "string",
      label: "Return URL",
      description: "URL where DocuSign redirects the signer after the embedded signing session.",
    },
    recipientName: {
      propDefinition: [
        docusign,
        "recipientName",
      ],
    },
    recipientEmail: {
      propDefinition: [
        docusign,
        "recipientEmail",
      ],
    },
    clientUserId: {
      type: "string",
      label: "Client User ID",
      description: "The embedded recipient client user ID. This must match the value set when creating the envelope recipient.",
    },
    authenticationMethod: {
      type: "string",
      label: "Authentication Method",
      description: "How your app authenticated the signer before requesting this URL.",
      optional: true,
      default: "none",
    },
    pingUrl: {
      type: "string",
      label: "Ping URL",
      description: "Optional URL DocuSign pings while the signing session is active.",
      optional: true,
    },
    pingFrequency: {
      type: "string",
      label: "Ping Frequency",
      description: "Optional ping interval in seconds. DocuSign supports values from 60 to 1200.",
      optional: true,
    },
  },
  async run({ $ }) {
    const baseUri = await this.docusign.getBaseUri({
      $,
      accountId: this.account,
    });
    const response = await this.docusign.createRecipientView({
      $,
      baseUri,
      envelopeId: this.envelopeId,
      data: {
        returnUrl: this.returnUrl,
        authenticationMethod: this.authenticationMethod,
        email: this.recipientEmail,
        userName: this.recipientName,
        clientUserId: this.clientUserId,
        pingUrl: this.pingUrl,
        pingFrequency: this.pingFrequency,
      },
    });

    $.export("$summary", `Created recipient view URL for envelope ${this.envelopeId}`);
    return response;
  },
};
