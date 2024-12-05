import signaturit from "../../signaturit.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "signaturit-create-signature-request-from-template",
  name: "Create Signature Request from Template",
  description: "Creates a signature request using a pre-existing template. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    signaturit,
    files: {
      propDefinition: [
        signaturit,
        "files",
      ],
    },
    name: {
      propDefinition: [
        signaturit,
        "name",
      ],
    },
    recipients: {
      propDefinition: [
        signaturit,
        "recipients",
      ],
    },
    body: {
      propDefinition: [
        signaturit,
        "body",
      ],
      optional: true,
    },
    brandingId: {
      propDefinition: [
        signaturit,
        "brandingId",
      ],
      optional: true,
    },
    callbackUrl: {
      propDefinition: [
        signaturit,
        "callbackUrl",
      ],
      optional: true,
    },
    data: {
      propDefinition: [
        signaturit,
        "data",
      ],
      optional: true,
    },
    deliveryType: {
      propDefinition: [
        signaturit,
        "deliveryType",
      ],
      optional: true,
    },
    expireTime: {
      propDefinition: [
        signaturit,
        "expireTime",
      ],
      optional: true,
    },
    eventsUrl: {
      propDefinition: [
        signaturit,
        "eventsUrl",
      ],
      optional: true,
    },
    replyTo: {
      propDefinition: [
        signaturit,
        "replyTo",
      ],
      optional: true,
    },
    reminders: {
      propDefinition: [
        signaturit,
        "reminders",
      ],
      optional: true,
    },
    signingMode: {
      propDefinition: [
        signaturit,
        "signingMode",
      ],
      optional: true,
    },
    subject: {
      propDefinition: [
        signaturit,
        "subject",
      ],
      optional: true,
    },
    type: {
      propDefinition: [
        signaturit,
        "typeSignature",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.signaturit.createSignatureRequest();
    $.export("$summary", `Created signature request with ID: ${response.id}`);
    return response;
  },
};
