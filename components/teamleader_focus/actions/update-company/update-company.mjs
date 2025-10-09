import teamleaderFocus from "../../teamleader_focus.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "teamleader_focus-update-company",
  name: "Update Company",
  description: "Update a company. [See the documentation](https://developer.focus.teamleader.eu/docs/api/companies-update)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    teamleaderFocus,
    companyId: {
      propDefinition: [
        teamleaderFocus,
        "company",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name of the company",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email of the company",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Phone number of the company",
      optional: true,
    },
    website: {
      type: "string",
      label: "Website",
      description: "Website of the company",
      optional: true,
    },
    businessTypeId: {
      propDefinition: [
        teamleaderFocus,
        "businessType",
      ],
    },
    vatNumber: {
      type: "string",
      label: "VAT Number",
      description: "VAT number of the company",
      optional: true,
    },
    nationalIdentificationNumber: {
      type: "string",
      label: "National Identification Number",
      description: "National identification number of the company",
      optional: true,
    },
    iban: {
      type: "string",
      label: "IBAN",
      description: "IBAN of the company",
      optional: true,
    },
    bic: {
      type: "string",
      label: "BIC",
      description: "BIC of the company",
      optional: true,
    },
    language: {
      type: "string",
      label: "Language",
      description: "Language of the company. Example: `en`",
      optional: true,
    },
    responsibleUserId: {
      propDefinition: [
        teamleaderFocus,
        "user",
      ],
      label: "Responsible User ID",
      description: "ID of the user responsible for the company",
      optional: true,
    },
    remarks: {
      type: "string",
      label: "Remarks",
      description: "Remarks about the company",
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Tags of the company. Note: This will overwrite existing tags.",
      optional: true,
    },
    marketingMailsConsent: {
      type: "boolean",
      label: "Marketing Mails Consent",
      description: "Whether the company has consented to receive marketing emails",
      optional: true,
    },
    preferredCurrency: {
      type: "string",
      label: "Preferred Currency",
      description: "Preferred currency of the company",
      optional: true,
      options: constants.CURRENCY_CODES,
    },
  },
  async run({ $ }) {
    const data = {
      id: this.companyId,
      name: this.name,
      business_type_id: this.businessTypeId,
      vat_number: this.vatNumber,
      national_identification_number: this.nationalIdentificationNumber,
      website: this.website,
      iban: this.iban,
      bic: this.bic,
      language: this.language,
      responsible_user_id: this.responsibleUserId,
      remarks: this.remarks,
      tags: this.tags,
      marketing_mails_consent: this.marketingMailsConsent,
      preferred_currency: this.preferredCurrency,
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

    const response = await this.teamleaderFocus.updateCompany({
      data,
      $,
    });

    $.export("$summary", `Successfully updated company with ID ${this.companyId}`);

    return response;
  },
};
