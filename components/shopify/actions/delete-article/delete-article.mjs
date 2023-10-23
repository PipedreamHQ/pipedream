import app from "../../common/rest-admin.mjs";
import common from "./common.mjs";

export default {
  ...common,
  key: "shopify-delete-article",
  name: "Delete Article",
  description: "Delete an existing blog article. [See The Documentation](https://shopify.dev/docs/api/admin-rest/2023-04/resources/article#delete-blogs-blog-id-articles-article-id)",
  version: "0.0.4",
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
