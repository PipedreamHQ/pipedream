import videoask from "../../videoask.app.mjs";

export default {
  key: "videoask-create-form",
  name: "Create Form",
  description: "Creates a new form in VideoAsk. [See the documentation](https://developers.videoask.com/#a9237dfd-e0c1-4099-a9f1-e035d95797a1)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    videoask,
    organizationId: {
      propDefinition: [
        videoask,
        "organizationId",
      ],
    },
    title: {
      type: "string",
      label: "Title",
      description: "Title of the new form",
    },
    showContactName: {
      type: "boolean",
      label: "Show Contact Name",
      description: "Whether to show the contact name",
      optional: true,
    },
    showContactEmail: {
      type: "boolean",
      label: "Show Contact Email",
      description: "Whether to show the contact email",
      optional: true,
    },
    showContactPhoneNumber: {
      type: "boolean",
      label: "Show Contact Phone Number",
      description: "Whether to show the contact phone number",
      optional: true,
    },
    showConsent: {
      type: "boolean",
      label: "Show Consent",
      description: "Whether to show consent form",
      optional: true,
    },
    requiresContactName: {
      type: "boolean",
      label: "Requires Contact Name",
      description: "Whether to require contact name",
      optional: true,
    },
    requiresContactEmail: {
      type: "boolean",
      label: "Requires Contact Email",
      description: "Whether to require contact email",
      optional: true,
    },
    requiresContactPhoneNumber: {
      type: "boolean",
      label: "Requires Contact Phone Number",
      description: "Whether to require contact phone number",
      optional: true,
    },
    requiresConsent: {
      type: "boolean",
      label: "Requires Consent",
      description: "Whether to require consent",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.videoask.createForm({
      $,
      organizationId: this.organizationId,
      data: {
        title: this.title,
        show_contact_name: this.showContactName,
        show_contact_email: this.showContactEmail,
        show_contact_phone_number: this.showContactPhoneNumber,
        show_consent: this.showConsent,
        requires_contact_name: this.requiresContactName,
        requires_contact_email: this.requiresContactEmail,
        requires_contact_phone_number: this.requiresContactPhoneNumber,
        requires_consent: this.requiresConsent,
      },
    });
    $.export("$summary", `Successfully created form ${this.title}`);
    return response;
  },
};
