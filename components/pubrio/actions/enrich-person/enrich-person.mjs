import pubrio from "../../pubrio.app.mjs";

export default {
  key: "pubrio-enrich-person",
  name: "Enrich Person",
  description: "Get enriched person data with full professional details (uses credits). [See the documentation](https://docs.pubrio.com)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    openWorldHint: true,
  },
  props: {
    pubrio,
    lookupType: { propDefinition: [pubrio, "lookupTypePerson"] },
    value: { propDefinition: [pubrio, "lookupValue"] },
  },
  async run({ $ }) {
    const response = await this.pubrio.makeRequest({
      $,
      method: "POST",
      url: "/people/enrichment",
      data: { [this.lookupType]: this.value },
    });
    $.export("$summary", "Successfully enriched person");
    return response;
  },
};
