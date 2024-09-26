import common from "../shopify_developer_app.app.mjs";
import restAdmin from "../../shopify/common/rest-admin.mjs";

export default {
  ...common,
  propDefinitions: {
    ...common.propDefinitions,
    bodyHtml: {
      type: "string",
      label: "Body HTML",
      description: "The text content of the page, complete with HTML markup.",
    },
    pageId: {
      type: "string",
      label: "Page ID",
      description: "The unique numeric identifier for the page.",
      async options() {
        const { pages } = await this.listPages();
        return pages.map(({
          id: value, title: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    blogId: {
      type: "string",
      label: "Blog ID",
      description: "The unique numeric identifier for the blog.",
      async options() {
        const { blogs } = await this.listBlogs();
        return blogs.map(({
          id: value, title: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    articleId: {
      type: "string",
      label: "Article ID",
      description: "The unique numeric identifier for the article.",
      async options({ blogId }) {
        const { articles } = await this.listBlogArticles({
          blogId,
        });
        return articles.map(({
          id: value, title: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    ...common.methods,
    ...restAdmin.methods,
    getHeaders(headers) {
      return {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": this.$auth.access_token,
        ...headers,
      };
    },
  },
};
