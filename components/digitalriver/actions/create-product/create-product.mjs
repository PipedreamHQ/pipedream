import digitalriver from "../../digitalriver.app.mjs";

export default {
  key: "digitalriver-create-product",
  name: "Create a Product",
  description: "Creates a new product on the Digital River platform. [See the documentation](https://www.digitalriver.com/docs/digital-river-api-reference/#tag/SKUs/operation/createSkus)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    digitalriver,
    id: {
      type: "string",
      label: "Sku Id",
      description: "The unique identifier of a SKU.",
      optional: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "The product's name.",
    },
    eccn: {
      type: "string",
      label: "ECCN",
      description: "The export control classification number.",
      optional: true,
    },
    hsCode: {
      type: "string",
      label: "HS Code",
      description: "The international and US Harmonized System code (sometimes referred to as the Harmonized Tariff Schedule).",
      optional: true,
    },
    skuGroupId: {
      propDefinition: [
        digitalriver,
        "skuGroupId",
      ],
      optional: true,
    },
    partNumber: {
      type: "string",
      label: "Part Number",
      description: "The manufacturer's part number.",
      optional: true,
    },
    manufacturerId: {
      type: "string",
      label: "Manufacturer Id",
      description: "The manufacturer's unique identifier.",
      optional: true,
    },
    taxCode: {
      type: "string",
      label: "Tax Code",
      description: "The designated tax code.",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "A description of the product.",
      optional: true,
    },
    image: {
      type: "string",
      label: "Image URL",
      description: "An image URL of the product.",
      optional: true,
    },
    weight: {
      type: "string",
      label: "Weight",
      description: "The weight of the product measured in the unit specified by weightUnit.",
      optional: true,
    },
    weightUnit: {
      type: "string",
      label: "Weight Unit",
      description: "The unit of measurement applied to the weight.",
      options: [
        "oz",
        "lb",
        "g",
        "kg",
      ],
      optional: true,
    },
    itemBreadcrumb: {
      type: "string",
      label: "Item Breadcrumb",
      description: "The full path to the category where item is included. Categories should be separated by ** > **.",
      optional: true,
    },
    countryOfOrigin: {
      type: "string",
      label: "Country Of Origin",
      description: "A two-letter Alpha-2 country code as described in the ISO 3166 international standard.",
      optional: true,
    },
    metadata: {
      propDefinition: [
        digitalriver,
        "metadata",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      digitalriver,
      ...data
    } = this;

    const response = await digitalriver.createProduct({
      $,
      data,
    });

    $.export("$summary", `Successfully created product with ID: ${response.id}`);
    return response;
  },
};
