import sendoso from "../../sendoso.app.mjs";

export default {
  key: "sendoso-list-catalog-items",
  name: "List Catalog Items",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Retrieve a list of catalog items available for sending. [See the documentation](https://developer.sendoso.com/marketplace/reference/products/get-products)",
  type: "action",
  props: {
    sendoso,
    categoryIds: {
      type: "string[]",
      label: "Category IDs",
      description: "Filter by category IDs",
      optional: true,
    },
    after: {
      type: "string",
      label: "After",
      description: "The start for cursor for pagination. This is returned in the pagination object of the previous response.",
      optional: true,
    },
  },
  async run({ $ }) {
    const params = {
      category_ids: this.categoryIds,
      after: this.after,
    };

    const response = await this.sendoso.listCatalogItems({
      $,
      params,
    });

    const count = Array.isArray(response) ?
      response.length :
      (response.data?.length || 0);
    $.export("$summary", `Successfully retrieved ${count} catalog item(s)`);
    return response;
  },
};

