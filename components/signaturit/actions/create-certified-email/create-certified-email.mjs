import signaturit from "../../signaturit.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "signaturit-create-certified-email",
  name: "Create Certified Email",
  description: "Initiates the creation of a certified email. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    signaturit: {
      type: "app",
      app: "signaturit",
    },
    attachments: {
      propDefinition: [
        signaturit,
        "attachments",
      ],
    },
    recipients: {
      propDefinition: [
        signaturit,
        "recipients",
      ],
    },
    type: {
      propDefinition: [
        signaturit,
        "type",
      ],
    },
    templates: {
      propDefinition: [
        signaturit,
        "templates",
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
    eventsUrl: {
      propDefinition: [
        signaturit,
        "eventsUrl",
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
    subject: {
      propDefinition: [
        signaturit,
        "subject",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.signaturit.createCertifiedEmail();
    $.export("$summary", `Created certified email with ID: ${response.id}`);
    return response;
  },
};
