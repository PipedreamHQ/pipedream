import app from "../../common/rest-admin.mjs";
import common from "../../../shopify/actions/update-article/common.mjs";

export default {
  ...common,
  key: "shopify_developer_app-update-article",
  name: "Update Article",
  description: "Update a blog article. [See The Documentation](https://shopify.dev/docs/api/admin-rest/2023-04/resources/article#put-blogs-blog-id-articles-article-id)",
  version: "0.0.2",
  type: "action",
  props: {
    app,
    blogId: {
      propDefinition: [
        app,
        "blogId",
      ],
    },
    articleId: {
      propDefinition: [
        app,
        "articleId",
        ({ blogId }) => ({
          blogId,
        }),
      ],
    },
    title: {
      description: "The title of the article.",
      propDefinition: [
        app,
        "title",
      ],
    },
    bodyHtml: {
      description: "The text content of the article, complete with HTML markup.",
      propDefinition: [
        app,
        "bodyHtml",
      ],
    },
  },
};
