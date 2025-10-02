import teamleaderFocus from "../../teamleader_focus.app.mjs";

export default {
  key: "teamleader_focus-create-contact",
  name: "Create Contact",
  description: "Add a new contact. [See the documentation](https://developer.teamleader.eu/#/reference/crm/contacts/contacts.add)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    teamleaderFocus,
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

    const response = await this.teamleaderFocus.createContact({
      data,
      $,
    });

    if (response) {
      $.export("$summary", `Successfully created contact with ID ${response.data.id}`);
    }

    return response;
  },
};
