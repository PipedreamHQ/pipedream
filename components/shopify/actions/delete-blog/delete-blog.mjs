import app from "../../common/rest-admin.mjs";
import common from "./common.mjs";

export default {
  ...common,
  key: "shopify-delete-blog",
  name: "Delete Blog",
  description: "Delete an existing blog. [See The Documentation](https://shopify.dev/docs/api/admin-rest/2023-04/resources/blog#delete-blogs-blog-id)",
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
  },
};
