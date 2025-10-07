import accuranker from "../../accuranker.app.mjs";

export default {
  key: "accuranker-create-keywords",
  name: "Create Keywords",
  description: "Add keywords to a domain in Accuranker. [See the documentation](https://app.accuranker.com/api/write-docs#tag/Keywords/operation/Create%20keyword)",
  version: "0.0.{{ts}}",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    accuranker,
    domainId: {
      propDefinition: [
        accuranker,
        "domainId",
      ],
    },
    keywords: {
      type: "string[]",
      label: "Keywords",
      description: "List of keyword to add to the domain",
    },
  },
  async run({ $ }) {
    const response = await this.accuranker.createKeywords({
      $,
      data: {
        domain_id: this.domainId,
        keywords: this.keywords,
      },
    });

    $.export("$summary", `Successfully added ${this.keywords.length} keyword(s) to the domain ${this.domainId}`);
    return response;
  },
};
