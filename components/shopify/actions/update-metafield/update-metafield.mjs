import common from "../common/metafield-actions.mjs";
import consts from "../common/consts.mjs";

export default {
  ...common,
  key: "shopify-update-metafield",
  name: "Update Metafield",
  description: "Updates a metafield belonging to a resource. [See the docs](https://shopify.dev/api/admin-rest/2023-01/resources/metafield#put-blogs-blog-id-metafields-metafield-id)",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    type: {
      type: "string",
      label: "Type",
      description: "The type of data that the metafield stores in the `value` field. Refer to the list of [supported types](https://shopify.dev/apps/custom-data/metafields/types).",
      async options() {
        return Object.keys(consts.METAFIELD_TYPES);
      },
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = await this.getOwnerIdProp(this.ownerResource);

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
          return this.shopify.getMetafieldOptions(this.ownerResource, this.ownerId);
        },
      };
    }

    if (this.type) {
      props.value = {
        type: consts.METAFIELD_TYPES[this.type],
        label: "Value",
        description: "The data to store in the metafield",
      };
    }

    return props;
  },
  async run({ $ }) {
    const { result } = await this.shopify.getMetafield(this.metafieldId);

    const params = {
      metafield_id: this.metafieldId,
      owner_id: `${this.ownerId}`,
      owner_resource: this.ownerResource,
      key: result.key,
      type: this.type,
      value: this.value,
      namespace: result.namespace,
    };
    const response = await this.shopify.updateMetafield(this.metafieldId, params);
    $.export("$summary", `Updated metafield for object with ID ${this.ownerId}`);
    return response;
  },
};
