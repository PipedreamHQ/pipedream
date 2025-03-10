import common from "../common/metafield-actions.mjs";
import constants from "../common/constants.mjs";

export default {
  ...common,
  key: "shopify-create-metafield",
  name: "Create Metafield",
  description: "Creates a metafield belonging to a resource. [See the documentation](https://shopify.dev/docs/api/admin-graphql/unstable/mutations/metafieldsSet)",
  version: "0.0.11",
  type: "action",
  props: {
    ...common.props,
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
      options: Object.keys(constants.METAFIELD_TYPES),
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = await this.getOwnerIdProp(this.ownerResource);

    if (this.type) {
      props.value = {
        type: "string",
        label: "Value",
        description: "The data to store in the metafield",
      };
    }

    return props;
  },
  async run({ $ }) {
    const response = await this.shopify.createMetafield({
      metafields: {
        key: this.key,
        type: this.type,
        value: this.value,
        namespace: this.namespace,
        ownerId: this.ownerId,
      },
    });
    if (response.metafieldsSet.userErrors.length > 0) {
      throw new Error(response.metafieldsSet.userErrors[0].message);
    }
    $.export("$summary", `Created metafield for object with ID ${this.ownerId}`);
    return response;
  },
};
