import metafieldActions from "../common/metafield-actions.mjs";
import common from "@pipedream/shopify/actions/delete-metafield/delete-metafield.mjs";
import shopify from "../../shopify_developer_app.app.mjs";

const {
  name, description, type, ...others
} = common;

export default {
  ...others,
  key: "shopify_developer_app-delete-metafield",
  version: "0.0.11",
  name,
  description,
  type,
  props: {
    shopify,
    ...metafieldActions.props,
  },
  methods: {
    ...metafieldActions.methods,
  },
  async additionalProps() {
    const props = await this.getOwnerIdProp(this.ownerResource); console.log(props);

    if (props.ownerId) {
      props.ownerId = {
        ...props.ownerId,
        reloadProps: true,
      };
    }

    if (this.ownerResource && this.ownerId) {
      props.metafieldId = {
        type: "string",
        label: "Metafield ID",
        description: "The metafield to update",
        options: async () => {
          const metafields = await this.listMetafields(this.ownerResource, this.ownerId);
          return metafields?.map(({
            id: value, key: label,
          }) => ({
            value,
            label,
          })) || [];
        },
      };
    }

    return props;
  },
};
