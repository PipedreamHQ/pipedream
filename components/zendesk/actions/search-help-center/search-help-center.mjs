import app from "../../zendesk.app.mjs";
import { toCommaSeparated } from "../../common/utils.mjs";

export default {
  key: "zendesk-search-help-center",
  name: "Search Help Center",
  description: "Searches across knowledge base articles, community posts, and external records using the Zendesk unified Guide search. [See the documentation](https://developer.zendesk.com/api-reference/help_center/help-center-api/search/).",
  type: "action",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    locales: {
      propDefinition: [
        app,
        "locale",
      ],
      type: "string[]",
      label: "Locales",
      description: "Required. One or more locales to search in (e.g. `en-us`, `en-gb`). If an invalid or disabled locale is specified, no results are returned.",
    },
    query: {
      type: "string",
      label: "Search Query",
      description: "The search text to match. If omitted, results are returned using internal ordering.",
      optional: true,
    },
    contentTypes: {
      type: "string[]",
      label: "Content Types",
      description: "Limit results to one or more content types. Use `ARTICLE` or `POST`. To search external records, use the **External Source IDs** filter instead.",
      optional: true,
      options: [
        "ARTICLE",
        "POST",
      ],
    },
    brandIds: {
      propDefinition: [
        app,
        "brandId",
      ],
      type: "string[]",
      label: "Brand IDs",
      description: "Limit results to articles or posts within these brands. If omitted, results are returned across all brands.",
    },
    categoryIds: {
      propDefinition: [
        app,
        "articleCategoryId",
      ],
      type: "string[]",
      label: "Category IDs",
      description: "Limit results to articles in these categories.",
      optional: true,
    },
    sectionIds: {
      propDefinition: [
        app,
        "sectionId",
      ],
      type: "string[]",
      label: "Section IDs",
      description: "Limit results to articles in these sections.",
      optional: true,
    },
    topicIds: {
      propDefinition: [
        app,
        "topicId",
      ],
      type: "string[]",
      label: "Topic IDs",
      description: "Limit results to posts in these community topics.",
    },
    externalSourceIds: {
      propDefinition: [
        app,
        "externalSourceId",
      ],
      type: "string[]",
      label: "External Source IDs",
      description: "Limit results to specific external sources. If omitted, results are returned across all sources.",
    },
    pageSize: {
      type: "integer",
      label: "Page Size",
      description: "Maximum number of results to return per page. Between 1 and 50. Default is 10.",
      optional: true,
      default: 10,
    },
    pageAfter: {
      type: "string",
      label: "Page After Cursor",
      description: "Cursor string for the next page of results, obtained from a previous response.",
      optional: true,
    },
    customSubdomain: {
      propDefinition: [
        app,
        "customSubdomain",
      ],
    },
  },
  async run({ $: step }) {
    const {
      locales,
      query,
      contentTypes,
      brandIds,
      categoryIds,
      sectionIds,
      topicIds,
      externalSourceIds,
      pageSize,
      pageAfter,
      customSubdomain,
    } = this;

    const results = await this.app.searchHelpCenter({
      step,
      customSubdomain,
      params: {
        query,
        "filter[locales]": toCommaSeparated(locales),
        "filter[content_types]": toCommaSeparated(contentTypes),
        "filter[brand_ids]": toCommaSeparated(brandIds),
        "filter[category_ids]": toCommaSeparated(categoryIds),
        "filter[section_ids]": toCommaSeparated(sectionIds),
        "filter[topic_ids]": toCommaSeparated(topicIds),
        "filter[external_source_ids]": toCommaSeparated(externalSourceIds),
        "page[size]": pageSize,
        "page[after]": pageAfter,
      },
    });

    step.export("$summary", `Successfully retrieved ${results.results?.length ?? 0} Help Center result(s)`);

    return results;
  },
};
