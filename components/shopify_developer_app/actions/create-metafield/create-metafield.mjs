import metafieldActions from "../common/metafield-actions.mjs";
import common from "@pipedream/shopify/actions/create-metafield/create-metafield.mjs";
import shopify from "../../shopify_developer_app.app.mjs";
import constants from "../common/constants.mjs";

const {
  name, description, type, ...others
} = common;

export default {
  ...others,
  key: "shopify_developer_app-create-metafield",
  version: "0.0.11",
  name,
  description,
  type,
  props: {
    shopify,
    ownerResource: {
      type: "string",
      label: "Resource Type",
      description: "Filter by the resource type on which the metafield is attached to",
      options: constants.RESOURCE_TYPES.map((type) => ({
        ...type,
        value: type.value.toUpperCase(),
      })),
    },
    name: {
      type: "string",
      label: "Name",
      description: "The human-readable name for the metafield definition",
    },
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
    },
    pin: {
      type: "boolean",
      label: "Pin",
      description: "Whether to pin the metafield definition",
      default: false,
      optional: true,
    },
  },
  methods: {
    ...metafieldActions.methods,
    ...common.methods,
  },
};
