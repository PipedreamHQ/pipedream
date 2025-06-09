import picqer from "../../picqer.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "picqer-create-order",
  name: "Create Picqer Order",
  description: "Create a new order in Picqer with customer details, products, and optional warehouse assignment. [See the documentation](https://picqer.com/en/api/orders)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    picqer,
    customerDetails: {
      propDefinition: [
        picqer,
        "customerDetails",
      ],
    },
    products: {
      propDefinition: [
        picqer,
        "products",
      ],
    },
    warehouseId: {
      propDefinition: [
        picqer,
        "warehouseId",
      ],
      optional: true,
    },
    idcustomer: {
      type: "integer",
      label: "Customer ID",
      description: "Linked to resource Customers. When idcustomer is not given, a guest-order will be created.",
      optional: true,
    },
    idtemplate: {
      type: "integer",
      label: "Template ID",
      description: "Linked to resource Templates, if null the default template will be selected.",
      optional: true,
    },
    idshippingprovider_profile: {
      type: "integer",
      label: "Shipping Provider Profile ID",
      description: "The preferred shipping provider profile for this order.",
      optional: true,
    },
    reference: {
      type: "string",
      label: "Reference",
      description: "Reference for customer, will be printed on invoice and picking list.",
      optional: true,
    },
    customer_remarks: {
      type: "string",
      label: "Customer Remarks",
      description: "Remarks from the customer, will be printed on picking and packing list.",
      optional: true,
    },
    partialdelivery: {
      type: "boolean",
      label: "Partial Delivery",
      description: "If Picqer AutoSplit is enabled, order can be split over multiple picklists over multiple warehouses. If disabled, it will wait for all products to be available.",
      optional: true,
    },
    discount: {
      type: "float",
      label: "Discount",
      description: "Discount percentage of order.",
      optional: true,
    },
    invoiced: {
      type: "boolean",
      label: "Invoiced",
      description: "If this order is already invoiced, set this to true. This will ensure Picqer will not invoice this order.",
      optional: true,
    },
    preferred_delivery_date: {
      type: "string",
      label: "Preferred Delivery Date",
      description: "Customer supplied preferred delivery date, in format yyyy-mm-dd.",
      optional: true,
    },
    language: {
      type: "string",
      label: "Language",
      description: "Language used for communication with customer, 'nl' or 'en'.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.picqer.createOrder({
      idcustomer: this.idcustomer,
      idtemplate: this.idtemplate,
      idshippingprovider_profile: this.idshippingprovider_profile,
      reference: this.reference,
      customer_remarks: this.customer_remarks,
      partialdelivery: this.partialdelivery,
      discount: this.discount,
      invoiced: this.invoiced,
      preferred_delivery_date: this.preferred_delivery_date,
      language: this.language,
      customerDetails: this.customerDetails,
      products: this.products.map(JSON.parse),
      warehouses: this.warehouseId
        ? [
          this.warehouseId,
        ]
        : undefined,
    });

    $.export("$summary", `Order created successfully with ID ${response.idorder}`);
    return response;
  },
};
