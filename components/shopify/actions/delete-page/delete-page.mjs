import app from "../../common/rest-admin.mjs";
import common from "./common.mjs";

export default {
  ...common,
  key: "shopify-delete-page",
  name: "Delete Page",
  description: "Delete an existing page. [See The Documentation](https://shopify.dev/docs/api/admin-rest/2023-04/resources/page#delete-pages-page-id)",
  version: "0.0.4",
  type: "action",
  props: {
    app,
    pageId: {
      propDefinition: [
        app,
        "pageId",
      ],
    },
  },
};
