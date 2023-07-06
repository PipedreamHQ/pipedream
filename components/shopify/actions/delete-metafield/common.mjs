export default {
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

    return props;
  },
  async run({ $ }) {
    const params = {
      metafield_id: this.metafieldId,
      owner_id: `${this.ownerId}`,
      owner_resource: this.ownerResource,
    };
    await this.shopify.resourceAction("metafield", "delete", params, this.metafieldId);
    $.export("$summary", `Deleted metafield with ID ${this.metafieldId}`);
    // nothing to return
  },
};
