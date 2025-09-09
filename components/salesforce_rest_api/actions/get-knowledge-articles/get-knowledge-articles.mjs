import common from "../common/knowledge.mjs";

export default {
  ...common,
  key: "salesforce_rest_api-get-knowledge-articles",
  name: "Get Knowledge Articles",
  description: "Get a page of online articles for the given language and category through either search or query. [See the documentation](https://developer.salesforce.com/docs/atlas.en-us.knowledge_dev.meta/knowledge_dev/sforce_api_rest_retrieve_article_list.htm)",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    q: {
      type: "string",
      label: "Search Term",
      description: "Performs an SOSL search. If this property is not set, an SOQL query runs. The characters `?` and `*` are used for wildcard searches. The characters `(`, `)`, and `\"` are used for complex search terms. [See the documentation](https://developer.salesforce.com/docs/atlas.en-us.soql_sosl.meta/soql_sosl/sforce_api_calls_sosl_find.htm).",
      optional: true,
    },
    channel: {
      type: "string",
      label: "Channel",
      description: "Where articles are visible (App, Pkb, Csp, Prm).",
      optional: true,
      options: [
        {
          label: "Internal Knowledge App",
          value: "App",
        },
        {
          label: "Public Knowledge Base",
          value: "Pkb",
        },
        {
          label: "Customer Portal",
          value: "Csp",
        },
        {
          label: "Partner Portal",
          value: "Prm",
        },
      ],
    },
    categories: {
      type: "string",
      label: "Categories",
      description: "This should be a map in json format `{\"group1\": \"category1\", \"group2\": \"category2\", ...}`. It must be unique in each group:category pair, otherwise you get `ARGUMENT_OBJECT_PARSE_ERROR`. There is a limit of three data category conditions, otherwise you get `INVALID_FILTER_VALUE`.",
      optional: true,
    },
    queryMethod: {
      type: "string",
      label: "Query Method",
      description: "Only valid when categories are specified, defaults to `ABOVE_OR_BELOW`.",
      optional: true,
      options: [
        "AT",
        "BELOW",
        "ABOVE",
        "ABOVE_OR_BELOW",
      ],
    },
    sort: {
      type: "string",
      label: "Sort By",
      description: "Field to sort results by. Defaults to `LastPublishedDate` for query and relevance for search",
      optional: true,
      options: [
        "LastPublishedDate",
        "CreatedDate",
        "Title",
        "ViewScore",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      q,
      channel,
      language,
      categories,
      queryMethod,
      sort,
    } = this;

    const items = await app.paginate({
      resultsKey: "articles",
      requester: app.getKnowledgeArticles,
      requesterArgs: {
        $,
        headers: {
          ...app._makeRequestHeaders(),
          "Accept": "application/json",
          "Accept-Language": language || "en-US",
        },
        params: {
          q,
          channel,
          categories,
          queryMethod,
          sort,
        },
      },
    });

    $.export("$summary", `Successfully fetched \`${items.length}\` articles`);

    return items;
  },
};
