import common from "../common/metafield-actions.mjs";

export default {
  ...common,
  key: "shopify-update-metafield",
  name: "Update Metafield",
  description: "Updates the value of an existing metafield on a Shopify resource (product, customer, order, etc.) via the `metafieldsSet` mutation. Use this to change custom data stored on a record you've already identified. Select the owner resource and record, then the specific metafield to update, and provide the new value. This action resolves the selected metafield and reuses its existing `namespace`, `key`, and `type` — only the value is changed, and the metafield must already exist. The value must be a string serialized to the metafield's `type` — for example `10` for `number_integer`, `{\"color\":\"red\"}` for `json`, or `2026-08-12` for `date`. To discover a resource's metafields first, use a list/get metafields action. [See the documentation](https://shopify.dev/docs/api/admin-graphql/latest/mutations/metafieldsSet)",
  version: "0.0.21",
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
