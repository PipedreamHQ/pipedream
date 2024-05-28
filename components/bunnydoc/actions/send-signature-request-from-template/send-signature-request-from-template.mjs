import bunnydoc from "../../bunnydoc.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "bunnydoc-send-signature-request-from-template",
  name: "Send Signature Request from Template",
  description: "Sends a signature request using a pre-designed bunnydoc template. [See the documentation](https://support.bunnydoc.com/doc/api/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    bunnydoc,
    templateId: {
      propDefinition: [
        bunnydoc,
        "templateId",
      ],
    },
    recipientEmail: {
      propDefinition: [
        bunnydoc,
        "recipientEmail",
      ],
      optional: true,
    },
    hookUrl: {
      propDefinition: [
        bunnydoc,
        "hookUrl",
      ],
    },
    webhookEvents: {
      propDefinition: [
        bunnydoc,
        "webhookEvents",
      ],
    },
  },
  async run({ $ }) {
    const recipients = this.recipientEmail
      ? [
        {
          role: "signer",
          email: this.recipientEmail,
        },
      ]
      : [];

    const response = await this.bunnydoc.createSignatureRequestFromTemplate({
      templateId: this.templateId,
      title: "Signature Request",
      emailMessage: "Please sign this document",
      signingOrder: false,
      recipients,
      fields: [],
    });

    await this.bunnydoc.subscribeWebhook({
      hookUrl: this.hookUrl,
      webhookEvents: this.webhookEvents,
    });

    $.export("$summary", "Successfully sent signature request and subscribed to webhook events");
    return response;
  },
};
