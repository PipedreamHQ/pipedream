import accuranker from "../../accuranker.app.mjs";

export default {
  key: "accuranker-list-domains",
  name: "List Domains",
  description: "List domains in Accuranker. [See the documentation](https://app.accuranker.com/api/read-docs#tag/Domains/operation/List%20Domains)",
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
        "display_name",
        "domain",
        "status",
        "created_at",
        "last_scraped",
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
