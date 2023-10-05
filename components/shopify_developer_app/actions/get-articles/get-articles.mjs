import app from "../../common/rest-admin.mjs";
import common from "../../../shopify/actions/get-articles/common.mjs";

export default {
  ...common,
  key: "shopify_developer_app-get-articles",
  name: "Get Articles",
  description: "Retrieve a list of all articles from a blog. [See The Documentation](https://shopify.dev/docs/api/admin-rest/2023-04/resources/article#get-blogs-blog-id-articles)",
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
  },
};
