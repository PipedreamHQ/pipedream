import app from "../../common/rest-admin.mjs";
import common from "../../../shopify/actions/delete-blog/common.mjs";

export default {
  ...common,
  key: "shopify_developer_app-delete-blog",
  name: "Delete Blog",
  description: "Delete an existing blog. [See The Documentation](https://shopify.dev/docs/api/admin-rest/2023-04/resources/blog#delete-blogs-blog-id)",
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
