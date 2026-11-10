import { ConfigurationError } from "@pipedream/platform";
import { EXPAND_PAGE_OPTIONS } from "../../common/constants.mjs";
import utils from "../../common/utils.mjs";
import app from "../../onenote.app.mjs";

export default {
  key: "onenote-search-pages",
  name: "Search Pages",
  description: "Search and list OneNote pages by title, creation date or other metadata. Use `search` for a case-insensitive title match (e.g., `weekly notes`, `feeding schedule`) and `filter` for structured OData queries (e.g., `createdDateTime gt 2026-01-01T00:00:00Z`); they are combined with `and`."
    + " Limitation: Microsoft Graph cannot search page **body content** here. To match on content, find candidates by title, then call **Get Page Content** on each. Use **Get Page** for a single page's metadata."
    + " Set `sectionId` to list or search the pages of one section (find it with **Search Sections**); on accounts with many sections this is the reliable path, because without it the action must query each section in turn."
    + " Returns `{pages, nextLink}`; each page has its `id`, `title`, timestamps and links. A request returns at most `top` pages (default 20, max 100). If you get exactly that many, more may exist: call again with `skip` set to the number of pages already received. Example: `top` 20 then `skip` 20 returns pages 21-40."
    + " [See the documentation](https://learn.microsoft.com/en-us/graph/api/onenote-list-pages?view=graph-rest-1.0&tabs=http)",
  version: "1.1.0",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    sectionId: {
      propDefinition: [
        app,
        "sectionId",
      ],
      description: "Optional. Only list pages in this section, e.g. `1-a745a153-ea3f-4b6e-8f16-9163bfe64932` (use **Search Sections** to find the section ID in its `id` field). Recommended for accounts with many sections: Microsoft Graph rejects account-wide page queries there (error 20266), and this action then falls back to querying every section one at a time, which is slower. When set, use `skip` to page through the results.",
      optional: true,
    },
    search: {
      propDefinition: [
        app,
        "search",
      ],
      description: "Free-text search against page titles. Case-insensitive substring match. Example: `weekly notes`, `feeding schedule`. Translated server-side to `contains(tolower(title), '<value>')`.",
    },
    filter: {
      propDefinition: [
        app,
        "filter",
      ],
      description: "OData filter expression for structured queries. Example: `createdDateTime gt 2026-01-01T00:00:00Z`, `title eq 'Weekly Notes'`. Combined with `search` via `and` when both are set. [See the documentation](https://learn.microsoft.com/en-us/graph/query-parameters?tabs=http#filter)",
    },
    expand: {
      propDefinition: [
        app,
        "expand",
      ],
      options: EXPAND_PAGE_OPTIONS,
    },
    top: {
      type: "integer",
      label: "Top",
      description: "Number of pages to return, e.g. `20` (max 100). Defaults to 20 when omitted.",
      optional: true,
    },
    skip: {
      type: "integer",
      label: "Skip",
      min: 0,
      description: "Number of pages to skip before returning results, for paging through long lists, e.g. `20` to get the second page when `top` is 20. Defaults to 0.",
      optional: true,
    },
  },
  async run({ $ }) {
    if (this.filter && !utils.looksLikeOData(this.filter)) {
      throw new ConfigurationError(
        `The Filter field expects OData $filter syntax, but received "${this.filter}".`
        + " For natural-language queries, use the **Search** field instead"
        + ` (e.g., set Search to "${this.filter}" and leave Filter empty).`
        + " For OData filtering, use syntax like: `title eq 'My Page'`,"
        + " `startswith(title, 'Daily')`, or `createdDateTime gt 2026-01-01T00:00:00Z`."
        + " [See OData filter docs](https://learn.microsoft.com/en-us/graph/query-parameters?tabs=http#filter).",
      );
    }

    // Translate `search` to a title contains filter, then combine with user filter.
    const combinedFilter = utils.buildSearchFilter({
      search: this.search,
      filter: this.filter,
      property: "title",
    });

    const response = await this.app.getPages({
      $,
      sectionId: this.sectionId,
      params: {
        "$filter": combinedFilter,
        "$expand": this.expand,
        "$top": this.top,
        "$skip": this.skip,
      },
    });

    const pages = response.value ?? [];

    $.export("$summary", `Found ${pages.length} page${pages.length === 1
      ? ""
      : "s"}`);

    return {
      pages,
      nextLink: response["@odata.nextLink"] ?? null,
    };
  },
};
