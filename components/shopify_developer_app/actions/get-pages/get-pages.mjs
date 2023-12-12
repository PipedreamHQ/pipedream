import app from "../../common/rest-admin.mjs";
import common from "../../../shopify/actions/get-pages/common.mjs";

export default {
  ...common,
  key: "shopify_developer_app-get-pages",
  name: "Get Pages",
  description: "Retrieve a list of all pages. [See The Documentation](https://shopify.dev/docs/api/admin-rest/2023-04/resources/page#get-pages)",
  version: "0.0.2",
  type: "action",
  props: {
    app,
  },
};
