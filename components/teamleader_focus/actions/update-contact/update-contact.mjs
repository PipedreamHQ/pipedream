import teamleaderFocus from "../../teamleader_focus.app.mjs";

export default {
  key: "teamleader_focus-update-contact",
  name: "Update Contact",
  description: "Update a contact. [See the documentation](https://developer.focus.teamleader.eu/docs/api/contacts-update)",
  version: "0.0.1",
  type: "action",
  props: {
    teamleaderFocus,
    contactId: {
      propDefinition: [
        teamleaderFocus,
        "contact",
      ],
    },
    firstName: {
      propDefinition: [
        teamleaderFocus,
        "firstName",
      ],
    },
    lastName: {
      propDefinition: [
        teamleaderFocus,
        "lastName",
      ],
      optional: true,
    },
    email: {
      propDefinition: [
        teamleaderFocus,
        "email",
      ],
    },
    website: {
      propDefinition: [
        teamleaderFocus,
        "website",
      ],
    },
    phone: {
      propDefinition: [
        teamleaderFocus,
        "phone",
      ],
    },
    iban: {
      propDefinition: [
        teamleaderFocus,
        "iban",
      ],
    },
    bic: {
      propDefinition: [
        teamleaderFocus,
        "bic",
      ],
    },
    language: {
      propDefinition: [
        teamleaderFocus,
        "language",
      ],
    },
    remarks: {
      propDefinition: [
        teamleaderFocus,
        "remarks",
      ],
    },
    tags: {
      propDefinition: [
        teamleaderFocus,
        "tags",
      ],
    },
    marketingMailsConsent: {
      propDefinition: [
        teamleaderFocus,
        "marketingMailsConsent",
      ],
    },
  },
  async run({ $ }) {
    const data = {
      id: this.contactId,
      first_name: this.firstName,
      last_name: this.lastName,
      website: this.website,
      iban: this.iban,
      bic: this.bic,
      language: this.language,
      remarks: this.remarks,
      tags: this.tags,
      marketing_mails_consent: this.marketingMailsConsent,
    };

    if (this.email) {
      data.emails = [
        {
          type: "primary",
          email: this.email,
        },
      ];
    }
    if (this.phone) {
      data.telephones = [
        {
          type: "phone",
          number: this.phone,
        },
      ];
    }

    const response = await this.teamleaderFocus.updateContact({
      data,
      $,
    });

    $.export("$summary", `Successfully updated contact with ID ${this.contactId}`);

    return response;
  },
};
