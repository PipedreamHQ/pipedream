import agileCrm from "../../agile_crm.app.mjs";

export default {
  key: "agile_crm-create-deal-note",
  name: "Create Deal Note",
  description: "Adds a note to a deal. [See the documentation](https://github.com/agilecrm/rest-api#45-create-note-to-a-deal)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    agileCrm,
    deals: {
      propDefinition: [
        agileCrm,
        "deal",
      ],
      type: "string[]",
      label: "Deals",
      description: "An array of deal identifiers to add the note to",
    },
    subject: {
      propDefinition: [
        agileCrm,
        "noteSubject",
      ],
    },
    description: {
      propDefinition: [
        agileCrm,
        "noteDescription",
      ],
    },
  },
  async run({ $ }) {
    const deals = Array.isArray(this.deals)
      ? this.deals
      : JSON.parse(this.deals);

    const response = await this.agileCrm.createDealNote({
      data: {
        deal_ids: deals,
        subject: this.subject,
        description: this.description,
      },
      $,
    });

    if (response) {
      $.export("$summary", `Successfully added note to ${deals.length} deal${deals.length === 1
        ? ""
        : "s"}`);
    }

    return response;
  },
};
