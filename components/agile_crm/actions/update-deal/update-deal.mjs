import agileCrm from "../../agile_crm.app.mjs";
import pickBy from "lodash.pickby";

export default {
  key: "agile_crm-update-deal",
  name: "Update Deal",
  description: "Updates an existing deal in Agile CRM. [See the documentation](https://github.com/agilecrm/rest-api#34-update-deal-partial-update)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    agileCrm,
    deal: {
      propDefinition: [
        agileCrm,
        "deal",
      ],
    },
    contacts: {
      propDefinition: [
        agileCrm,
        "contact",
      ],
      type: "string[]",
      label: "Contacts",
      description: "An array of contact identifiers related to the deal",
      optional: true,
    },
    name: {
      propDefinition: [
        agileCrm,
        "dealName",
      ],
      optional: true,
    },
    expectedValue: {
      propDefinition: [
        agileCrm,
        "expectedValue",
      ],
      optional: true,
    },
    probability: {
      propDefinition: [
        agileCrm,
        "probability",
      ],
      optional: true,
    },
    milestone: {
      propDefinition: [
        agileCrm,
        "milestone",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    let contacts;
    if (this.contacts?.length) {
      contacts = Array.isArray(this.contacts)
        ? this.contacts
        : JSON.parse(this.contacts);
    }

    const data = pickBy({
      id: this.deal,
      contact_ids: contacts,
      name: this.name,
      expected_value: this.expectedValue,
      probability: this.probability,
      milestone: this.milestone,
      close_date: this.closeDate
        ? Date.parse(this.closeDate)
        : undefined,
    });

    const response = await this.agileCrm.updateDeal({
      data,
      $,
    });

    $.export("$summary", `Successfully updated deal with ID ${response.id}`);

    return response;
  },
};
