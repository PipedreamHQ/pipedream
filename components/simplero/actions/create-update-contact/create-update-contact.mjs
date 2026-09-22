import { parseObject } from "../../common/utils.mjs";
import app from "../../simplero.app.mjs";

export default {
  type: "action",
  key: "simplero-create-update-contact",
  name: "Create/Update Contact",
  description: "Create a new contact or update an existing contact with the same email. [See the documentation](https://github.com/Simplero/Simplero-API?tab=readme-ov-file#createupdate-contact)",
  version: "0.0.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    email: {
      propDefinition: [
        app,
        "email",
      ],
    },
    firstName: {
      propDefinition: [
        app,
        "firstName",
      ],
      optional: true,
    },
    lastName: {
      propDefinition: [
        app,
        "lastName",
      ],
      optional: true,
    },
    ipAddress: {
      propDefinition: [
        app,
        "ipAddress",
      ],
      optional: true,
    },
    referrer: {
      propDefinition: [
        app,
        "referrer",
      ],
      optional: true,
    },
    ref: {
      propDefinition: [
        app,
        "ref",
      ],
      optional: true,
    },
    landingPageId: {
      propDefinition: [
        app,
        "landingPageId",
      ],
      optional: true,
    },
    tags: {
      propDefinition: [
        app,
        "tags",
      ],
      optional: true,
    },
    note: {
      type: "string",
      label: "Note",
      description: "A note to add to the contact",
      optional: true,
    },
    phone: {
      propDefinition: [
        app,
        "phone",
      ],
      optional: true,
    },
    gdprConsent: {
      propDefinition: [
        app,
        "gdprConsent",
      ],
      optional: true,
    },
    gdprConsentText: {
      type: "string",
      label: "GDPR Consent Text",
      description: "The text of the GDPR consent request (e.g. Subscribe to our newsletter)",
      optional: true,
    },
    customFields: {
      type: "object",
      label: "Custom Fields",
      description: "Custom fields to add to the contact. Keys are custom field ID. [See the documentation](https://github.com/Simplero/Simplero-API?tab=readme-ov-file#custom-contact-fields) for more information.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.createOrUpdateContact({
      $,
      data: {
        track: "Pipedream",
        override: "yes",
        email: this.email,
        first_name: this.firstName,
        last_name: this.lastName,
        ip_address: this.ipAddress,
        referrer: this.referrer,
        phone: this.phone,
        tags: this.tags && parseObject(this.tags) || [],
        note: this.note,
        gdpr_consent: +this.gdprConsent,
        gdpr_consent_text: this.gdprConsentText,
        ...(this.customFields && parseObject(this.customFields)),
      },
    });

    const action = response.contact_since === "less than a minute"
      ? "created"
      : "updated";

    $.export("$summary", `Successfully ${action} contact: ${this.email}`);

    return response;
  },
};

