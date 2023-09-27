import app from "../../common/rest-admin.mjs";
import common from "../../../shopify/actions/delete-article/common.mjs";

export default {
  ...common,
  key: "shopify_developer_app-delete-article",
  name: "Delete Article",
  description: "Delete an existing blog article. [See The Documentation](https://shopify.dev/docs/api/admin-rest/2023-04/resources/article#delete-blogs-blog-id-articles-article-id)",
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
  },
};
