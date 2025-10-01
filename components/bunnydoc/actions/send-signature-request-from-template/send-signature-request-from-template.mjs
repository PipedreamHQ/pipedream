import bunnydoc from "../../bunnydoc.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "bunnydoc-send-signature-request-from-template",
  name: "Send Signature Request from Template",
  description: "Sends a signature request using a pre-designed bunnydoc template. [See the documentation](https://support.bunnydoc.com/doc/api/#create-signature-request)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    bunnydoc,
    templateId: {
      type: "string",
      label: "Template ID",
      description: "The ID of the bunnydoc template to be used for the signature request.",
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title of the signature resquest.",
      optional: true,
    },
    emailMessage: {
      type: "string",
      label: "Email Message",
      description: "The message of the signature resquest.",
      optional: true,
    },
    signingOrder: {
      type: "boolean",
      label: "Signing Order",
      description: "Set the signing order.",
      default: false,
    },
    recipients: {
      type: "string",
      label: "Recipients",
      description: "A stringified array of objects of recipients. E.g. [{\"role\" : \"role1\", \"name\" : \"Signer1\", \"email\" : \"signer1@example.com\", \"accessCode\" : \"\"}].",
    },
    fields: {
      type: "string",
      label: "Fields",
      description: "A stringified array of objects of fields. E.g. [{ \"apiLabel\": \"textFieldPatientHistory\", \"value\": \"My test value\", \"readOnly\" : 1 }]",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.bunnydoc.createSignatureRequestFromTemplate({
      $,
      data: {
        templateId: this.templateId,
        title: this.title,
        emailMessage: this.emailMessage,
        signingOrder: this.signingOrder,
        recipients: parseObject(this.recipients),
        fields: parseObject(this.fields),
      },
    });

    $.export("$summary", "Successfully sent signature request.");
    return response;
  },
};
