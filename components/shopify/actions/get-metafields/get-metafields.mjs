import common from "../common/metafield-actions.mjs";

export default {
  ...common,
  key: "shopify-get-metafields",
  name: "Get Metafields",
  description: "Retrieves a list of metafields that belong to a resource. [See the documentation](https://shopify.dev/docs/api/admin-graphql/unstable/queries/metafields)",
  version: "0.0.13",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    ...common.props,
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
