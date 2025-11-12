import app from "../../baselinker.app.mjs";
import constants from "../../common/constants.mjs";
import method from "../../common/method.mjs";

export default {
  key: "baselinker-create-order",
  name: "Create Order",
  description: "It allows adding a new order to the BaseLinker order manager. [See the Documentation](https://api.baselinker.com/index.php?method=addOrder).",
  type: "action",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    orderStatusId: {
      propDefinition: [
        app,
        "orderStatusId",
      ],
    },
    inventoryId: {
      optional: true,
      description: "The ID of the inventory in which the products are located. If the inventory ID is not provided, the products will be searched in the **default** inventory.",
      propDefinition: [
        app,
        "inventoryId",
      ],
    },
    currency: {
      optional: true,
      propDefinition: [
        app,
        "currency",
      ],
    },
    paymentMethod: {
      type: "string",
      label: "Payment Method",
      description: "The payment method of the order.",
      optional: true,
    },
    paymentMethodCOD: {
      type: "boolean",
      label: "Payment Method COD",
      description: "Flag indicating whether the type of payment is COD (cash on delivery)",
      optional: true,
    },
    paid: {
      type: "boolean",
      label: "Paid",
      description: "Information whether the order is already paid. The value `1` automatically adds a full payment to the order.",
      optional: true,
    },
    userComments: {
      type: "string",
      label: "Buyer Comments",
      description: "Comments added by the customer when placing the order.",
      optional: true,
    },
    adminComments: {
      type: "string",
      label: "Seller Comments",
      description: "Comments added by the seller to the order.",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the customer who placed the order.",
      optional: true,
    },
    wantInvoice: {
      type: "boolean",
      label: "Want Invoice",
      description: "Flag indicating whether the customer wants to receive an invoice.",
      optional: true,
    },
    numberOfProducts: {
      type: "integer",
      label: "Number Of Products",
      description: "The number of products in the order.",
      default: 1,
      reloadProps: true,
    },
  },
  async additionalProps() {
    return Array.from({
      length: this.numberOfProducts,
    }).reduce((acc, _, index) => {
      const {
        prefix,
        description,
      } = this.getPrefixAndDesc(index);

      return {
        ...acc,
        [`${prefix}name`]: {
          type: "string",
          label: `${description} Name`,
          description: `${description} The name of the product.`,
          optional: true,
        },
        [`${prefix}sku`]: {
          type: "string",
          label: `${description} SKU`,
          description: `${description} The SKU of the product.`,
          optional: true,
        },
        [`${prefix}quantity`]: {
          type: "integer",
          label: `${description} Quantity`,
          description: `${description} The quantity of the product.`,
          optional: true,
        },
        [`${prefix}storage`]: {
          type: "string",
          label: `${description} Storage`,
          description: `${description} Type of magazine from which the product comes.`,
          options: Object.values(constants.STORAGE),
          optional: true,
        },
        [`${prefix}productId`]: {
          type: "string",
          label: `${description} Product ID`,
          description: `${description} The ID of the product.`,
          optional: true,
          options: async ({ page }) => {
            let inventoryId = this.inventoryId;

            if (!inventoryId) {
              const {
                inventories: [
                  inventory,
                ],
              } = await this.app.listInventories();
              inventoryId = inventory?.inventory_id;
            }

            const response = await this.app.listInventoryProducts({
              data: {
                parameters: {
                  page,
                  inventory_id: inventoryId,
                },
              },
            });
            return Object.entries(response.products)
              .map(([
                , {
                  id: value, name: label,
                },
              ]) => ({
                label,
                value,
              }));
          },
        },
      };
    }, {});
  },
  methods: {
    getPrefixAndDesc(index) {
      const productIdx = index + 1;
      return {
        prefix: `product${productIdx}${constants.SEP}`,
        description: `Product ${productIdx} -`,
      };
    },
    getProduct(index) {
      const { prefix } = this.getPrefixAndDesc(index);
      const {
        [`${prefix}name`]: name,
        [`${prefix}sku`]: sku,
        [`${prefix}quantity`]: quantity,
        [`${prefix}storage`]: storage,
        [`${prefix}productId`]: product_id,
      } = this;
      return {
        name,
        sku,
        quantity,
        storage,
        product_id,
      };
    },
    getProducts() {
      return Array.from({
        length: this.numberOfProducts,
      }).map((_, index) => this.getProduct(index));
    },
    createOrder(args = {}) {
      return this.app.connector({
        ...args,
        data: {
          method: method.ADD_ORDER,
          ...args.data,
        },
      });
    },
  },
  async run({ $: step }) {
    const {
      orderStatusId,
      currency,
      paymentMethod,
      paymentMethodCOD,
      paid,
      userComments,
      adminComments,
      email,
      wantInvoice,
    } = this;

    const response = await this.createOrder({
      data: {
        parameters: {
          order_status_id: orderStatusId,
          currency,
          payment_method: paymentMethod,
          payment_method_cod: paymentMethodCOD,
          paid,
          user_comments: userComments,
          admin_comments: adminComments,
          email,
          want_invoice: wantInvoice,
          products: this.getProducts(),
        },
      },
    });

    step.export("$summary", `Successfully created order ${response.order_id}.`);

    return response;
  },
};
