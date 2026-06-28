import notion from "../../notion.app.mjs";

export default {
  key: "notion-search",
  name: "Search",
  description:
    "Search Notion for pages and databases (data sources) by title."
    + " **Use this first to resolve a page or database name into an ID** that the other Notion tools require (e.g. **Query Data Source**, **Retrieve Database Schema**, **Get Page**, **Create Page**)."
    + " Leave `query` blank to list everything the integration can access."
    + " Set `filter` to `data_source` to find databases or `page` to find pages — on the current Notion API a database is returned as a `data_source` object, and its `id` is the **data source ID** you pass to the database tools."
    + " [See the documentation](https://developers.notion.com/reference/post-search)",
  version: "1.0.0",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    notion,
    query: {
      type: "string",
      label: "Query",
      description: "Text to match against page and data source titles. Leave blank to return all accessible objects.",
      optional: true,
    },
    filter: {
      type: "string",
      label: "Object Type",
      description: "Restrict results to `page` or `data_source` (database). Omit to return both.",
      optional: true,
      options: [
        "page",
        "data_source",
      ],
    },
    pageSize: {
      propDefinition: [
        notion,
        "pageSize",
      ],
    },
    startCursor: {
      propDefinition: [
        notion,
        "startCursor",
      ],
      description: "Pagination cursor from a previous response's `next_cursor`. Omit for the first page.",
    },
  },
  async run({ $ }) {
    const params = {
      page_size: this.pageSize || undefined,
      start_cursor: this.startCursor || undefined,
    };
    if (this.filter) {
      params.filter = {
        property: "object",
        value: this.filter,
      };
    }

    const response = await this.notion.search(this.query || undefined, params);

    const safeTitle = (object) => {
      try {
        return object.object === "data_source"
          ? this.notion.extractDataSourceTitle(object)
          : this.notion.extractPageTitle(object);
      } catch {
        return "Untitled";
      }
    };

    const results = (response.results || []).map((object) => ({
      id: object.id,
      object: object.object,
      title: safeTitle(object),
      url: object.url,
      last_edited_time: object.last_edited_time,
    }));

    $.export("$summary", `Found ${results.length} object${results.length === 1
      ? ""
      : "s"}${this.query
      ? ` matching "${this.query}"`
      : ""}`);

    return {
      results,
      has_more: response.has_more,
      next_cursor: response.next_cursor,
    };
  },
};
