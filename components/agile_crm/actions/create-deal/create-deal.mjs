import agileCrm from "../../agile_crm.app.mjs";

export default {
  key: "agile_crm-create-deal",
  name: "Create Deal",
  description: "Create a new deal in Agile CRM. [See the documentation](https://github.com/agilecrm/rest-api#33-create-deal)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    agileCrm,
    name: {
      propDefinition: [
        agileCrm,
        "dealName",
      ],
    },
    expectedValue: {
      propDefinition: [
        agileCrm,
        "expectedValue",
      ],
    },
    probability: {
      propDefinition: [
        agileCrm,
        "probability",
      ],
    },
    milestone: {
      propDefinition: [
        agileCrm,
        "milestone",
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
    closeDate: {
      type: "string",
      label: "Close Date",
      description: "Close date of the deal in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format: `YYYY-MM-DDTHH:MM:SSZ`",
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

    const data = {
      contact_ids: contacts,
      name: this.name,
      expected_value: this.expectedValue,
      probability: this.probability,
    };
    if (this.milestone) {
      data.milestone = this.milestone;
    }
    if (this.closeDate) {
      data.close_date = Date.parse(this.closeDate);
    }

    const response = await this.agileCrm.createDeal({
      data,
      $,
    });

    $.export("$summary", `Successfully created deal with ID ${response.id}`);

    return response;
  },
};
