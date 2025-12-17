import common from "../common/metafield-actions.mjs";

export default {
  ...common,
  key: "shopify-delete-metafield",
  name: "Delete Metafield",
  description: "Deletes a metafield belonging to a resource. [See the documentation](https://shopify.dev/docs/api/admin-graphql/latest/mutations/metafieldsDelete)",
  version: "0.0.11",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
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
  async run({ $ }) {
    const metafields = await this.listMetafields(this.ownerResource, this.ownerId);
    const metafield = metafields.find(({ id }) => id === this.metafieldId);

    const response = await this.shopify.deleteMetafield({
      metafields: {
        key: metafield.key,
        ownerId: this.ownerId,
        namespace: metafield.namespace,
      },
    });
    if (response.metafieldsDelete.userErrors.length > 0) {
      throw new Error(response.metafieldsDelete.userErrors[0].message);
    }
    $.export("$summary", `Deleted metafield with ID ${this.metafieldId}`);
    return response;
  },
};
