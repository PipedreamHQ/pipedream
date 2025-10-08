import accuranker from "../../accuranker.app.mjs";

export default {
  key: "accuranker-list-brands",
  name: "List Brands",
  description: "List brands in Accuranker. [See the documentation](https://app.accuranker.com/api/read-docs#tag/Brands/operation/List%20Brands)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    accuranker,
    fields: {
      type: "string[]",
      label: "Fields",
      description: "The fields to return",
      optional: true,
      default: [
        "id",
        "last_scraped",
        "group",
        "domain",
        "display_name",
        "brand_list",
        "competitors",
        "history",
        "created_at",
      ],
    },
    periodFrom: {
      propDefinition: [
        accuranker,
        "periodFrom",
      ],
    },
    periodTo: {
      propDefinition: [
        accuranker,
        "periodTo",
      ],
    },
    max: {
      propDefinition: [
        accuranker,
        "max",
      ],
    },
  },
  async run({ $ }) {
    const brands = this.accuranker.paginate({
      fn: this.accuranker.listBrands,
      args: {
        $,
        params: {
          fields: this.fields.join(","),
          period_from: this.periodFrom,
          period_to: this.periodTo,
        },
      },
      max: this.max,
    });

    const results = [];
    for await (const brand of brands) {
      results.push(brand);
    }

    $.export("$summary", `Found ${results.length} brand(s)`);

    return results;
  },
};
