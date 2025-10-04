import common from "../common/metafield-actions.mjs";

export default {
  ...common,
  key: "shopify-update-metafield",
  name: "Update Metafield",
  description: "Updates a metafield belonging to a resource. [See the documentation]()",
  version: "0.0.12",
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
        reloadProps: true,
      };
    }

    if (this.metafieldId) {
      props.value = {
        type: "string",
        label: "Value",
        description: "The data to store in the metafield",
      };
    }

    return props;
  },
  async run({ $ }) {
    const metafields = await this.listMetafields(this.ownerResource, this.ownerId);
    const metafield = metafields.find(({ id }) => id === this.metafieldId);

    const response = await this.shopify.updateMetafield({
      metafields: {
        ownerId: this.ownerId,
        key: metafield.key,
        type: metafield.type,
        value: this.value,
        namespace: metafield.namespace,
      },
    });
    if (response.metafieldsSet.userErrors.length > 0) {
      throw new Error(response.metafieldsSet.userErrors[0].message);
    }
    $.export("$summary", `Updated metafield for object with ID ${this.ownerId}`);
    return response;
  },
};
