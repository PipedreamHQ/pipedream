const notion = require("../../notion.app");

module.exports = {
  key: "notion-query-database-pages",
  name: "Query Database Pages",
  description:
    "Gets a list of Pages contained in the specified database, according to filter conditions.",
  version: "0.0.5",
  type: "action",
  props: {
    notion,
    databaseId: {
      propDefinition: [
        notion,
        "databaseId",
      ],
      optional: true,
    },
    filter: {
      type: "object",
      label: "Filter",
      description:
        "The [filter conditions](https://developers.notion.com/reference-link/post-database-query-filter) which if provided will limit the pages included in the results.",
      optional: true,
    },
    sorts: {
      type: "string",
      label: "Sorts",
      description:
        "A JSON-based array of [sort criteria](https://developers.notion.com/reference-link/post-database-query-sort) used to order the pages included in the results. Example `[{\"property\":\"Last ordered\",\"direction\":\"ascending\"}]`",
      optional: true,
    },
    startCursor: {
      propDefinition: [
        notion,
        "startCursor",
      ],
    },
    pageSize: {
      propDefinition: [
        notion,
        "pageSize",
      ],
    },
  },
  async run() {
    if (!this.databaseId) {
      throw new Error("Must provide databaseId parameters.");
    }
    const sorts = this.sorts
      ? JSON.parse(this.sorts)
      : null;
    return await this.notion.queryDatabasePages(
      this.databaseId,
      this.filter,
      sorts,
      this.startCursor,
      this.pageSize,
    );
  },
};
