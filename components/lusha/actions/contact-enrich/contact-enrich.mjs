import lusha from "../../lusha.app.mjs";

export default {
  key: "lusha-contact-enrich",
  name: "Enrich Contacts",
  description: "Enriches contacts based on provided IDs. [See the documentation](https://www.lusha.com/docs/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    lusha: {
      type: "app",
      app: "lusha",
    },
    enrichContactRequestId: {
      propDefinition: [
        "lusha",
        "enrichContactRequestId",
      ],
    },
    enrichContactIds: {
      propDefinition: [
        "lusha",
        "enrichContactIds",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.lusha.enrichContacts({
      enrichContactRequestId: this.enrichContactRequestId,
      enrichContactIds: this.enrichContactIds,
    });
    $.export("$summary", `Successfully enriched ${this.enrichContactIds.length} contacts`);
    return response;
  },
};
