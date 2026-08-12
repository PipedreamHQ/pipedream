import common from "../common/metafield-actions.mjs";

export default {
  ...common,
  key: "shopify-update-metafield",
  name: "Update Metafield",
  description: "Updates the value of an existing metafield on a Shopify resource (product, customer, order, etc.) via the `metafieldsSet` mutation. Use this to change custom data stored on a record you've already identified. Select the owner resource and record, then the specific metafield to update, and provide the new value. The value must be a string that conforms to the metafield's existing `type` — for example a number for `number_integer`, a JSON string for `json`, or an ISO-8601 date for `date`. The metafield's `namespace`, `key`, and `type` are reused from the existing definition and can't be changed here. Note: `metafieldsSet` is an upsert keyed on owner + namespace + key, so it will create the metafield if it doesn't already exist. To discover a resource's metafields first, use a list/get metafields action. [See the documentation](https://shopify.dev/docs/api/admin-graphql/latest/mutations/metafieldsSet)",
  version: "0.0.20",
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
