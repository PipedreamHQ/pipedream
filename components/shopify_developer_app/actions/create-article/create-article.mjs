import app from "../../common/rest-admin.mjs";
import common from "../../../shopify/actions/create-article/common.mjs";

export default {
  ...common,
  key: "shopify_developer_app-create-article",
  name: "Create Article",
  description: "Create a new blog article. [See The Documentation](https://shopify.dev/docs/api/admin-rest/2023-04/resources/article#post-blogs-blog-id-articles)",
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
