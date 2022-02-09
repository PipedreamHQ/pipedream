import notion from "@notionhq/client";

export default {
  type: "app",
  app: "notion",
  propDefinitions: {
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
