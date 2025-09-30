import zohoCommerce from "../../zoho_commerce.app.mjs";

export default {
  key: "zoho_commerce-create-product",
  name: "Create Product with Variant",
  description: "Create a new product with variants. [See the documentation](https://www.zoho.com/commerce/api/create-a-product-with-variant.html)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    zohoCommerce,
    orgId: {
      propDefinition: [
        zohoCommerce,
        "orgId",
      ],
    },
    name: {
      type: "string",
      label: "Product Name",
      description: "Name of the product.",
    },
    url: {
      type: "string",
      label: "URL",
      description: "URL of the product.",
    },
    description: {
      type: "string",
      label: "Product Description",
      description: "Description for the product.",
      optional: true,
    },
    attribute1: {
      type: "string",
      label: "Attribute Name 1",
      description: "Attribute name for the product",
      reloadProps: true,
    },
    attribute2: {
      type: "string",
      label: "Attribute Name 2",
      description: "Attribute name for the product",
      optional: true,
      reloadProps: true,
    },
    attribute3: {
      type: "string",
      label: "Attribute Name 3",
      description: "Attribute name for the product",
      optional: true,
      reloadProps: true,
    },
    numVariants: {
      type: "integer",
      label: "Number of Variants",
      description: "The number of product variants to create",
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (!this.numVariants) {
      return props;
    }
    for (let i = 1; i <= this.numVariants; i++) {
      props[`rate_${i}`] = {
        type: "string",
        label: `Variant ${i} Rate`,
        description: `Selling price of variant #${i}`,
      };
      props[`initial_stock_${i}`] = {
        type: "string",
        label: `Variant ${i} Initial Stock`,
        description: `Initial stock of variant #${i}`,
      };
      props[`sku_${i}`] = {
        type: "string",
        label: `Variant ${i} SKU`,
        description: `SKU of variant #${i}`,
        optional: true,
      };
      props[`length_${i}`] = {
        type: "string",
        label: `Variant ${i} Length`,
        description: `Length of variant #${i}`,
        optional: true,
      };
      props[`width_${i}`] = {
        type: "string",
        label: `Variant ${i} Width`,
        description: `Width of variant #${i}`,
        optional: true,
      };
      props[`height_${i}`] = {
        type: "string",
        label: `Variant ${i} Height`,
        description: `Height of variant #${i}`,
        optional: true,
      };
      props[`weight_${i}`] = {
        type: "string",
        label: `Variant ${i} Weight`,
        description: `Weight of variant #${i}`,
        optional: true,
      };
      if (this.attribute1) {
        props[`${this.attribute1}_${i}`] = {
          type: "string",
          label: `Variant ${i} ${this.attribute1} value`,
        };
      }
      if (this.attribute2) {
        props[`${this.attribute2}_${i}`] = {
          type: "string",
          label: `Variant ${i} ${this.attribute2} value`,
        };
      }
      if (this.attribute3) {
        props[`${this.attribute3}_${i}`] = {
          type: "string",
          label: `Variant ${i} ${this.attribute3} value`,
        };
      }
    }
    return props;
  },
  async run({ $ }) {
    const variants = [];
    for (let i = 1; i <= this.numVariants; i++) {
      variants.push({
        rate: this[`rate_${i}`],
        initial_stock: this[`initial_stock_${i}`],
        sku: this[`sku_${i}`],
        package_details: {
          length: this[`length_${i}`],
          width: this[`width_${i}`],
          height: this[`height_${i}`],
          weight: this[`weight_${i}`],
        },
        attribute_option_name1: this[`${this.attribute1}_${i}`],
        attribute_option_name2: this[`${this.attribute2}_${i}`],
        attribute_option_name3: this[`${this.attribute3}_${i}`],
      });
    }

    const response = await this.zohoCommerce.createProduct({
      orgId: this.orgId,
      data: {
        name: this.name,
        url: this.url,
        product_description: this.description,
        attribute_name1: this.attribute1,
        attribute_type1: "text",
        attribute_name2: this.attribute2,
        attribute_type2: "text",
        attribute_name3: this.attribute3,
        attribute_type3: "text",
        variants,
      },
      $,
    });

    $.export("$summary", `Successfully created product ${response.product.product_id}.`);

    return response;
  },
};
