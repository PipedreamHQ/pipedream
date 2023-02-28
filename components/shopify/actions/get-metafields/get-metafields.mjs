import common from "../common/metafield-actions.mjs";

export default {
  ...common,
  key: "shopify-get-metafields",
  name: "Get Metafields",
  description: "Retrieves a list of metafields that belong to a resource. [See the docs](https://shopify.dev/api/admin-rest/2023-01/resources/metafield#get-metafields?metafield[owner-id]=382285388&metafield[owner-resource]=blog)",
  version: "0.0.5",
  type: "action",
  async additionalProps() {
    return this.getOwnerIdProp(this.ownerResource);
  },
  async run({ $ }) {
    const params = {
      metafield: {
        owner_resource: this.ownerResource,
        owner_id: this.ownerId,
      },
    };
    const response = await this.shopify.listMetafields(params);
    $.export("$summary", `Found ${response.length} metafield(s) for object with ID ${this.ownerId}`);
    return response;
  },
};
