const notion = require("../../notion.app");
const get = require("lodash/get");

module.exports = {
  key: "notion-search-items",
  name: "Search Items",
  description:
    "Searches all databases, pages and child pages that are shared with the integration, according to filter conditions.",
  version: "0.0.35",
  type: "action",
  props: {
    notion,
    query: {
      type: "string",
      label: "Query",
      description:
        "Limits which pages are returned by comparing the query to the database or page title.",
      optional: true,
      async options() {
        const options = [];
        const notionItems = [];
        const notionDatabases = await this.notion.getAllItems("database");
        const notionPages = await this.notion.getAllItems("page");
        notionDatabases.forEach((notionDatabase) =>
          notionItems.push(notionDatabase));
        notionPages.forEach((notionPage) => notionItems.push(notionPage));
        for (const notionItem of notionItems) {
          //Populating options with Notion databases
          if ([
            "database",
          ].includes(notionItem.object)) {
            const notionDatabaseTitle = get(notionItem, [
              "title",
              "length",
            ]);
            if (notionDatabaseTitle) {
              options.push({
                label: `(DATABASE) ${notionItem.title[0].text.content}`,
                value: notionItem.title[0].text.content,
              });
            }
          } else {
            //Populating options with Notion pages
            if ([
              "page",
            ].includes(notionItem.object)) {
              const notionPageTitle = get(notionItem, [
                "properties",
                "Name",
                "title",
                "length",
              ]);
              if (notionPageTitle) {
                options.push({
                  label: `(PAGE) ${notionItem.properties.Name.title[0].text.content}`,
                  value: notionItem.properties.Name.title[0].text.content,
                });
              }
            }
          }
        }
        return options;
      },
    },
    sortDirection: {
      type: "string",
      label: "Sort Direction",
      description:
        "Results will be sorted using this direction. Sort direction currenty is only applied against `last_edited_time`",
      options: [
        "ascending",
        "descending",
      ],
      optional: true,
    },
    searchFor: {
      type: "string",
      label: "Search For",
      options: [
        "Page",
        "Database",
      ],
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
    let sort = null;
    if (this.sortDirection) {
      sort = {
        direction: this.sortDirection,
        timestamp: "last_edited_time",
      };
    }
    let filter = null;
    if (this.searchFor) {
      filter = {
        value: this.searchFor.toLowerCase(),
        property: "object",
      };
    }
    return await this.notion.searchItems(
      this.query,
      sort,
      filter,
      this.startCursor,
      this.pageSize,
    );
  },
};
