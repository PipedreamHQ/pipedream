import app from "../../mews.app.mjs";

export default {
  name: "Fetch Products",
  description: "Retrieve products using Mews Connector API. [See the documentation](https://mews-systems.gitbook.io/connector-api/operations/products#get-all-products)",
  key: "mews-fetch-products",
  version: "0.0.2",
  type: "action",
  props: {
    app,
    serviceIds: {
      type: "string[]",
      label: "Service IDs",
      description: "Unique identifiers of the Services. Max 1000 items.",
      propDefinition: [
        app,
        "serviceId",
      ],
    },
    updatedStartUtc: {
      type: "string",
      label: "Updated Start (UTC)",
      description: "Start of the interval in which products were updated. ISO 8601 format.",
      optional: true,
    },
    updatedEndUtc: {
      type: "string",
      label: "Updated End (UTC)",
      description: "End of the interval in which products were updated. ISO 8601 format. Max 3 months interval.",
      optional: true,
    },
    enterpriseIds: {
      propDefinition: [
        app,
        "enterpriseIds",
      ],
    },
    productIds: {
      type: "string[]",
      label: "Product IDs",
      description: "Unique identifiers of the products. Max 1000 items.",
      optional: true,
      propDefinition: [
        app,
        "productId",
      ],
    },
    includeDefault: {
      type: "boolean",
      label: "Include Default",
      description: "Whether or not to include default products for the service, i.e. products which are standard includes and not true extras. For example, the night's stay would be the default product for a room reservation. These may be useful for accounting purposes but should not be displayed to customers for selection. If Product IDs are provided, Include Default defaults to true, otherwise it defaults to false.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app,
      serviceIds,
      updatedStartUtc,
      updatedEndUtc,
      enterpriseIds,
      productIds,
      includeDefault,
    } = this;

    const items = await app.paginate({
      requester: app.productsGetAll,
      requesterArgs: {
        $,
        data: {
          ServiceIds: serviceIds,
          ...(updatedStartUtc || updatedEndUtc) && {
            UpdatedUtc: {
              StartUtc: updatedStartUtc,
              EndUtc: updatedEndUtc,
            },
          },
          EnterpriseIds: enterpriseIds,
          ProductIds: productIds,
          IncludeDefault: includeDefault,
        },
      },
      resultKey: "Products",
    });

    $.export("$summary", `Successfully fetched ${items.length} product${items.length !== 1
      ? "s"
      : ""}`);
    return items;
  },
};

