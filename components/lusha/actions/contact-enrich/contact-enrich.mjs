import lusha from "../../lusha.app.mjs";

export default {
  key: "lusha-contact-enrich",
  name: "Enrich Contacts",
  description: "Enriches contacts based on provided IDs. [See the documentation](https://docs.lusha.com/apis/openapi/contact-search-and-enrich/enrichprospectingcontacts)",
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    lusha,
    requestId: {
      propDefinition: [
        lusha,
        "requestId",
      ],
      label: "Contact Request ID",
      description: "The request ID generated from the contact search response",
    },
    contactIds: {
      propDefinition: [
        lusha,
        "contactIds",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.lusha.enrichContacts({
      $,
      data: {
        requestId: this.requestId,
        contactIds: this.contactIds,
      },
    });
    $.export("$summary", `Successfully enriched ${this.contactIds.length} contacts`);
    return response;
  },
};
