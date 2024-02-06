import app from "../../common/rest-admin.mjs";
import common from "../../../shopify/actions/create-page/common.mjs";

export default {
  ...common,
  key: "shopify_developer_app-create-page",
  name: "Create Page",
  description: "Create a new page. [See The Documentation](https://shopify.dev/docs/api/admin-rest/2023-04/resources/page#post-pages)",
  version: "0.0.2",
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
