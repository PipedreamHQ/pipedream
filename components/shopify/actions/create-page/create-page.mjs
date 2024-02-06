import app from "../../common/rest-admin.mjs";
import common from "./common.mjs";

export default {
  ...common,
  key: "shopify-create-page",
  name: "Create Page",
  description: "Create a new page. [See The Documentation](https://shopify.dev/docs/api/admin-rest/2023-04/resources/page#post-pages)",
  version: "0.0.4",
  type: "action",
  props: {
    app,
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
