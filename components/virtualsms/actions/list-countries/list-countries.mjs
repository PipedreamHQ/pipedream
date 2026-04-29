import virtualsms from "../../virtualsms.app.mjs";

export default {
  key: "virtualsms-list-countries",
  name: "List Countries",
  description: "List all supported countries with current stock indicators (`available_phones`, `total_phones`). Use the returned `country_id` (ISO-3166-1 alpha-2) when calling **Rent Number**. [See the documentation](https://virtualsms.io/docs/api-reference/introduction)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    virtualsms,
  },
  async run({ $ }) {
    const response = await this.virtualsms.listCountries({
      $,
    });
    const count = Array.isArray(response?.countries)
      ? response.countries.length
      : (Array.isArray(response)
        ? response.length
        : 0);
    $.export("$summary", `Retrieved ${count} countries`);
    return response;
  },
};
