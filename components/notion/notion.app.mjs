import notion from "@notionhq/client";

export default {
  type: "app",
  app: "notion",
  propDefinitions: {
    pageId: {
      type: "string",
      label: "Page ID",
      description: "The identifier for a Notion page",
      async options() {
        return (await this.searchPage()).results
          .map((page) => {
            let title = Object.values(page.properties)
              .map((property) => {
                if (property.type === "title" && property.title.length > 0) {
                  return property.title
                    .map((title) => title.plain_text)
                    .filter((title) => title.length > 0)
                    .reduce((prev, next) => prev + next);
                }
              })
              .filter((title) => title);
            return {
              label: title[0] ?? "Untitled",
              value: page.id,
            };
          });
      },
    },
    title: {
      type: "string",
      label: "Page Title",
      description: "The words contained in the page title to search for. Leave blank to list all pages",
      optional: true,
    },
  },
  methods: {
    _getNotionClient() {
      return new notion.Client({
        auth: this.$auth.oauth_access_token,
      });
    },
    async retrievePage(pageId) {
      return await this._getNotionClient().pages.retrieve({
        page_id: pageId,
      });
    },
    async searchPage(title) {
      return await this._getNotionClient().search({
        query: title,
        filter: {
          property: "object",
          value: "page",
        },
      });
    },
  },
};
