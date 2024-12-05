import { toSingleLineString } from "../../common/utils.mjs";

export default {
  methods: {
    /**
     * Formats the order data response
     * @param {object} order - The order object from Shopify
     * @returns {object} - Formatted order data
     */
    formatOrderData(order) {
      return {
        id: order.id,
        order_number: order.order_number,
        total_price: order.total_price,
        created_at: order.created_at,
        updated_at: order.updated_at,
        fulfillment_status: order.fulfillment_status,
        financial_status: order.financial_status,
        customer: order.customer,
        line_items: order.line_items,
        shipping_address: order.shipping_address,
        billing_address: order.billing_address,
      };
    },
  },
  props: {
    orderFields: {
      type: "string[]",
      label: "Order Fields",
      description: toSingleLineString(`
        Select which fields to include in the response. 
        If none selected, returns all available fields.
        See Shopify Order API documentation for available fields:
        https://shopify.dev/api/admin-graphql/2024-10/queries/order
      `),
      optional: true,
    },
    includeMetafields: {
      type: "boolean",
      label: "Include Metafields",
      description: "Whether to include order metafields in the response",
      optional: true,
      default: false,
    },
    includeCustomer: {
      type: "boolean",
      label: "Include Customer Details",
      description:
        "Whether to include detailed customer information in the response",
      optional: true,
      default: true,
    },
    includeLineItems: {
      type: "boolean",
      label: "Include Line Items",
      description: "Whether to include line items details in the response",
      optional: true,
      default: true,
    },
  },
};
