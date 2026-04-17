import pubrio from "../../pubrio.app.mjs";

export default {
  key: "pubrio-lookup-technology",
  name: "Lookup Technology",
  description: "Look up technologies used by a company. [See the documentation](https://docs.pubrio.com/en/api-reference/endpoint/companies/technology_lookup)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    pubrio,
    lookupType: {
      propDefinition: [
        pubrio,
        "lookupTypeDomain",
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
    let val = this.value;
    if (this.lookupType === "domain_id") {
      if (!/^\d+$/.test(this.value)) {
        throw new Error(`domain_id must be a valid integer, got: "${this.value}"`);
      }
      val = parseInt(this.value, 10);
    }
    const response = await this.pubrio.lookupTechnology({
      $,
      data: {
        [this.lookupType]: val,
      },
    });
    $.export("$summary", `Successfully looked up technologies for ${this.value}`);
    return response;
  },
};
