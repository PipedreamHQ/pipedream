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
  description: "Retrieve a list of catalog items available for sending. [See the documentation](https://sendoso.docs.apiary.io/#reference/catalog-management)",
  type: "action",
  props: {
    sendoso,
    limit: {
      propDefinition: [
        sendoso,
        "limit",
      ],
    },
    offset: {
      propDefinition: [
        sendoso,
        "offset",
      ],
    },
    category: {
      type: "string",
      label: "Category",
      description: "Filter by category.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      limit,
      offset,
      category,
    } = this;

    const params = {
      limit,
      offset,
    };
    if (category) params.category = category;

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

