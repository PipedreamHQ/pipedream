import common from "../common/metafield-actions.mjs";

export default {
  ...common,
  key: "shopify-get-metafields",
  name: "Get Metafields",
  description: "Retrieves a list of metafields that belong to a resource. [See the docs](https://shopify.dev/api/admin-rest/2023-01/resources/metafield#get-metafields?metafield[owner-id]=382285388&metafield[owner-resource]=blog)",
  version: "0.0.7",
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
    const {
      ownerResource,
      ownerId,
      namespace,
      key,
    } = this;

    const params = {
      metafield: {
        owner_resource: ownerResource,
        owner_id: ownerId,
      },
    };
    let response = await this.shopify.listMetafields(params);

    if (namespace?.length > 0) {
      response = response.filter((field) => namespace.includes(field.namespace));
    }

    if (key?.length > 0) {
      response = response.filter((field) => key.includes(field.key));
    }

    $.export("$summary", `Found ${response.length} metafield(s) for object with ID ${ownerId}`);
    return response;
  },
};
