import shopify from "../../shopify_developer_app.app.mjs";
import metaobjects from "../common/metaobjects.mjs";
import common from "../../../shopify/actions/get-metaobjects/common.mjs";

export default {
  ...metaobjects,
  ...common,
  key: "shopify_developer_app-get-metaobjects",
  name: "Get Metaobjects",
  description: "Retrieves a list of metaobjects. [See the documentation](https://shopify.dev/docs/api/admin-graphql/2023-04/queries/metaobjects)",
  version: "0.0.2",
  type: "action",
  props: {
    shopify,
    type: {
      type: "string",
      label: "Type",
      description: "The Metaobject Type",
      async options() {
        const { data: { metaobjectDefinitions: { nodes } } }
          = await this.listMetaobjectDefinitions();
        return nodes?.map(({ type }) => type) || [];
      },
    },
  },
};
