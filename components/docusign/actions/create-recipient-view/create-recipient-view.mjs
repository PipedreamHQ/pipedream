import docusign from "../../docusign.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "docusign-create-recipient-view",
  name: "Create Recipient View",
  description: "Create an embedded signing URL for a selected envelope recipient. The recipient must have been created with a `clientUserId`. [See the documentation](https://developers.docusign.com/docs/esign-rest-api/reference/envelopes/envelopeviews/createrecipient/)",
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
      propDefinition: [
        docusign,
        "envelopeId",
        (c) => ({
          account: c.account,
        }),
      ],
    },
    returnUrl: {
      type: "string",
      label: "Return URL",
      description: "URL where DocuSign redirects the signer after the embedded signing session.",
    },
    recipientId: {
      propDefinition: [
        docusign,
        "recipientId",
        (c) => ({
          account: c.account,
          envelopeId: c.envelopeId,
        }),
      ],
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
    const recipients = await this.docusign.listRecipients({
      $,
      baseUri,
      envelopeId: this.envelopeId,
    });
    const recipient = Object.values(recipients ?? {})
      .filter(Array.isArray)
      .flat()
      .find((candidate) => candidate.recipientId === this.recipientId);

    if (!recipient) {
      throw new ConfigurationError(`Recipient ID ${this.recipientId} was not found on envelope ${this.envelopeId}.`);
    }
    if (!recipient.clientUserId) {
      throw new ConfigurationError("The selected recipient does not have a clientUserId and cannot be used for embedded signing.");
    }

    const response = await this.docusign.createRecipientView({
      $,
      baseUri,
      envelopeId: this.envelopeId,
      data: {
        returnUrl: this.returnUrl,
        authenticationMethod: this.authenticationMethod,
        email: recipient.email,
        userName: recipient.name,
        clientUserId: recipient.clientUserId,
        pingUrl: this.pingUrl,
        pingFrequency: this.pingFrequency,
      },
    });

    $.export("$summary", `Created recipient view URL for recipient ${this.recipientId} on envelope ${this.envelopeId}`);
    return response;
  },
};
