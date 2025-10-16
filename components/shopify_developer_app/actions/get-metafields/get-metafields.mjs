import metafieldActions from "../common/metafield-actions.mjs";
import common from "@pipedream/shopify/actions/get-metafields/get-metafields.mjs";
import shopify from "../../shopify_developer_app.app.mjs";

const {
  name, description, type,
} = common;

export default {
  key: "shopify_developer_app-get-metafields",
  version: "0.0.11",
  name,
  description,
  type,
  props: {
    shopify,
    ...metafieldActions.props,
    namespace: {
      type: "string[]",
      label: "Namespace",
      description: "Filter results by namespace",
      optional: true,
    },
    key: {
      type: "string[]",
      label: "Key",
      description: "Filter results by key",
      optional: true,
    },
  },
  methods: {
    ...metafieldActions.methods,
  },
  async additionalProps() {
    return this.getOwnerIdProp(this.ownerResource);
  },
  async run({ $ }) {
    let response = await this.listMetafields(this.ownerResource, this.ownerId);

    if (this.namespace?.length > 0) {
      response = response.filter((field) => this.namespace.includes(field.namespace));
    }

    if (this.key?.length > 0) {
      response = response.filter((field) => this.key.includes(field.key));
    }

    $.export("$summary", `Found ${response.length} metafield(s) for object with ID ${this.ownerId}`);
    return response;
  },
};
