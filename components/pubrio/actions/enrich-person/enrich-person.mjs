import pubrio from "../../pubrio.app.mjs";

export default {
  key: "pubrio-enrich-person",
  name: "Enrich Person",
  description: "Get enriched person data with full professional details (uses credits). [See the documentation](https://docs.pubrio.com/en/api-reference/endpoint/people/lookup)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    pubrio,
    lookupType: {
      propDefinition: [
        pubrio,
        "lookupTypePerson",
      ],
    },
    value: {
      propDefinition: [
        pubrio,
        "lookupValue",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.pubrio.enrichPerson({
      $,
      data: {
        [this.lookupType]: this.value,
      },
    });
    $.export("$summary", `Successfully enriched person by ${this.lookupType}: ${this.value}`);
    return response;
  },
};
