import app from "../../common/rest-admin.mjs";
import common from "../../../shopify/actions/create-blog/common.mjs";

export default {
  ...common,
  key: "shopify_developer_app-create-blog",
  name: "Create Blog",
  description: "Create a new blog. [See The Documentation](https://shopify.dev/docs/api/admin-rest/2023-04/resources/blog#post-blogs)",
  version: "0.0.2",
  type: "action",
  props: {
    app,
    title: {
      description: "The title of the blog.",
      propDefinition: [
        app,
        "title",
      ],
    },
  },
};
