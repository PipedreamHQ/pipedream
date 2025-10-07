import accuranker from "../../accuranker.app.mjs";

export default {
  key: "accuranker-create-domain",
  name: "Create Domain",
  description: "Create a domain in Accuranker. [See the documentation](https://app.accuranker.com/api/write-docs#tag/Domains/operation/Create%20domain)",
  version: "0.0.{{ts}}",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    accuranker,
    accountId: {
      propDefinition: [
        accuranker,
        "accountId",
      ],
    },
    groupId: {
      propDefinition: [
        accuranker,
        "groupId",
        (c) => ({
          accountId: c.accountId,
        }),
      ],
    },
    domain: {
      type: "string",
      label: "Domain",
      description: "No http:// or www. You can enter a path that must be found. Eg. example.com/path. Search result must then begin with your path to match.",
    },
    country: {
      type: "string",
      label: "Country",
      description: "Two letters combination of country and language. Example: en-GB (for english in Great Britain)",
    },
    searchEngine: {
      type: "string",
      label: "Search Engine",
      description: "Search engine to use",
      options: [
        "Google",
        "Bing",
        "Baidu",
        "Youtube",
        "Naver",
        "ChatGPT",
        "Perplexity",
        "AI Overview",
        "AI Mode",
      ],
    },
    searchTypes: {
      type: "string",
      label: "Search Types",
      description: "Search types to use",
      options: [
        "Desktop",
        "Mobile",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.accuranker.createDomain({
      $,
      data: {
        domain: this.domain,
        group_id: this.groupId,
        default_searchsettings_names: [
          {
            countrylocale: this.country,
            search_engine_names: [
              {
                search_engine: this.searchEngine,
                search_type_names: this.searchTypes,
              },
            ],
          },
        ],
      },
    });

    $.export("$summary", `The domain ${this.domain} was successfully created!`);
    return response;
  },
};
