import shopify from "../../shopify.app.mjs";
import metaobjects from "../common/metaobjects.mjs";
import common from "./common.mjs";

export default {
  ...metaobjects,
  ...common,
  key: "shopify-create-metaobject",
  name: "Create Metaobject",
  description: "Creates a metaobject. [See the documentation](https://shopify.dev/docs/api/admin-graphql/2023-04/mutations/metaobjectCreate)",
  version: "0.0.4",
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
      reloadProps: true,
    },
  },
};
