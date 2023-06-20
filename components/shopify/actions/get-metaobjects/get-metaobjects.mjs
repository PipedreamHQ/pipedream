import common from "../common/metaobjects.mjs";

export default {
  ...common,
  key: "shopify-get-metaobjects",
  name: "Get Metaobjects",
  description: "Retrieves a list of metaobjects. [See the documentation](https://shopify.dev/docs/api/admin-graphql/2023-04/queries/metaobjects)",
  version: "0.0.1",
  type: "action",
  async run({ $ }) {
    const response = await this.listMetaobjects({
      type: this.type,
      $,
    });

    const numObjects = (response.data.metaobjects.nodes).length;
    $.export("$summary", `Successfully retrieved ${numObjects} metaobject${numObjects === 1
      ? ""
      : "s"}`);

    return response;
  },
};
