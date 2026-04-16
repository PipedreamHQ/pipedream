import pubrio from "../../pubrio.app.mjs";

export default {
  key: "pubrio-lookup-advertisement",
  name: "Lookup Advertisement",
  description: "Look up detailed advertisement information by advertisement search ID. [See the documentation](https://docs.pubrio.com/en/api-reference/endpoint/companies/advertisements_lookup)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    pubrio,
    advertisementSearchId: {
      type: "string",
      label: "Advertisement Search ID",
      description: "The advertisement search ID to look up",
    },
  },
  async run({ $ }) {
    const response = await this.pubrio.lookupAdvertisement({
      $,
      data: {
        advertisement_search_id: this.advertisementSearchId,
      },
    });
    $.export("$summary", `Successfully looked up advertisement ${this.advertisementSearchId}`);
    return response;
  },
};
