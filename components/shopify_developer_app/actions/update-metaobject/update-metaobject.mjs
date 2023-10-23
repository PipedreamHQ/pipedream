import shopify from "../../shopify_developer_app.app.mjs";
import metaobjects from "../common/metaobjects.mjs";
import common from "../../../shopify/actions/update-metaobject/common.mjs";

export default {
  ...metaobjects,
  ...common,
  key: "shopify_developer_app-update-metaobject",
  name: "Update Metaobject",
  description: "Updates a metaobject. [See the documentation](https://shopify.dev/docs/api/admin-graphql/2023-04/mutations/metaobjectUpdate)",
  version: "0.0.4",
  type: "action",
  methods: {
    ...metaobjects.methods,
    ...common.methods,
  },
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
    ...common.props,
  },
};
