import accuranker from "../../accuranker.app.mjs";

export default {
  key: "accuranker-list-keywords",
  name: "List Keywords",
  description: "List keywords for a domain in Accuranker. [See the documentation](https://app.accuranker.com/api/read-docs#tag/Keywords/operation/List%20Keywords)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    accuranker,
    domainId: {
      propDefinition: [
        accuranker,
        "domainId",
      ],
    },
    fields: {
      type: "string[]",
      label: "Fields",
      description: "The fields to return",
      optional: true,
      default: [
        "id",
        "keyword",
        "description",
        "ranks",
        "competitor_ranks",
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
      max: 100,
    },
  },
  async run({ $ }) {
    const keywords = this.accuranker.paginate({
      fn: this.accuranker.listKeywords,
      args: {
        $,
        domainId: this.domainId,
        params: {
          fields: this.fields.join(","),
          period_from: this.periodFrom,
          period_to: this.periodTo,
        },
      },
      max: this.max,
    });

    const results = [];
    for await (const keyword of keywords) {
      results.push(keyword);
    }

    $.export("$summary", `Found ${results.length} keyword(s)`);

    return results;
  },
};
