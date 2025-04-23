import notion from "@notionhq/client";
import common from "@pipedream/notion";

export default {
  ...common,
  type: "app",
  app: "notion_api_key",
  methods: {
    ...common.methods,
    _getNotionClient() {
      return new notion.Client({
        auth: this.$auth.api_secret,
        notionVersion: "2022-02-22",
      });
    },
  },
};
