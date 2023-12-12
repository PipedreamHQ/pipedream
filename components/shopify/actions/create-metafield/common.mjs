import consts from "../common/consts.mjs";

export default {
  props: {
    namespace: {
      type: "string",
      label: "Namespace",
      description: "A container for a group of metafields. Grouping metafields within a namespace prevents your metafields from conflicting with other metafields with the same key name. Must have between 3-255 characters.",
    },
    key: {
      type: "string",
      label: "Key",
      description: "The key of the metafield. Keys can be up to 64 characters long and can contain alphanumeric characters, hyphens, underscores, and periods.",
    },
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
    const value = this.type.includes("list.")
      ? JSON.stringify(this.value)
      : this.value;

    const params = {
      owner_id: `${this.ownerId}`,
      owner_resource: this.ownerResource,
      key: this.key,
      type: this.type,
      value,
      namespace: this.namespace,
    };
    const response = await this.shopify.createMetafield(params);
    $.export("$summary", `Created metafield for object with ID ${this.ownerId}`);
    return response;
  },
};
