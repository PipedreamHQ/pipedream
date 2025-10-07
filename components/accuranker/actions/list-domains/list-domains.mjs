import accuranker from "../../accuranker.app.mjs";

export default {
  key: "accuranker-list-domains",
  name: "List Domains",
  description: "List domains in Accuranker. [See the documentation](https://app.accuranker.com/api/read-docs#tag/Domains/operation/List%20Domains)",
  version: "0.0.{{ts}}",
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
        "display_name",
        "domain",
        "status",
        "created_at",
        "last_scraped",
      ],
    },
    periodFrom: {
      type: "string",
      label: "Period From",
      description: "Date in format: YYYY-MM-DD",
      optional: true,
    },
    periodTo: {
      type: "string",
      label: "Period To",
      description: "Date in format: YYYY-MM-DD",
      optional: true,
    },
    max: {
      type: "integer",
      label: "Max",
      description: "Maximum number of domains to return",
      optional: true,
      default: 100,
    },
  },
  async run({ $ }) {
    const domains = this.accuranker.paginate({
      fn: this.accuranker.listDomains,
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
    for await (const domain of domains) {
      results.push(domain);
    }

    $.export("$summary", `Found ${results.length} domain(s)`);

    return results;
  },
};
