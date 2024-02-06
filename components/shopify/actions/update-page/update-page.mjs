import app from "../../common/rest-admin.mjs";
import common from "./common.mjs";

export default {
  ...common,
  key: "shopify-update-page",
  name: "Update Page",
  description: "Update an existing page. [See The Documentation](https://shopify.dev/docs/api/admin-rest/2023-04/resources/page#put-pages-page-id)",
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
    title: {
      description: "The title of the page.",
      propDefinition: [
        app,
        "title",
      ],
    },
    bodyHtml: {
      propDefinition: [
        app,
        "bodyHtml",
      ],
    },
  },
};
