import app from "../../americommerce.app.mjs";

export default {
  key: "americommerce-change-order-status",
  name: "Change Order Status",
  description: "Changes the status of an existing order. [See the documentation](https://developers.cart.com/docs/rest-api/6898d9f254dfb-update-an-order-status).",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    orderStatusId: {
      optional: false,
      propDefinition: [
        app,
        "orderStatusId",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the order status.",
      optional: true,
    },
    isOpen: {
      type: "boolean",
      label: "Is Open",
      description: "Indicates whether the order status is open.",
      optional: true,
    },
    isDeclined: {
      type: "boolean",
      label: "Is Declined",
      description: "Indicates whether the order status is declined.",
      optional: true,
    },
    isCancelled: {
      type: "boolean",
      label: "Is Cancelled",
      description: "Indicates whether the order status is cancelled.",
      optional: true,
    },
    isShipped: {
      type: "boolean",
      label: "Is Shipped",
      description: "Indicates whether the order status is shipped.",
      optional: true,
    },
    color: {
      type: "string",
      label: "Color",
      description: "The color of the order status.",
      optional: true,
    },
    emailTemplateId: {
      propDefinition: [
        app,
        "emailTemplateId",
      ],
    },
    isFullyRefunded: {
      type: "boolean",
      label: "Is Fully Refunded",
      description: "Indicates whether the order status is fully refunded.",
      optional: true,
    },
    isPartiallyRefunded: {
      type: "boolean",
      label: "Is Partially Refunded",
      description: "Indicates whether the order status is partially refunded.",
      optional: true,
    },
    isQuoteStatus: {
      type: "boolean",
      label: "Is Quote Status",
      description: "Indicates whether the order status is a quote status.",
      optional: true,
    },
    isPartiallyShipped: {
      type: "boolean",
      label: "Is Partially Shipped",
      description: "Indicates whether the order status is partially shipped.",
      optional: true,
    },
  },
  methods: {
    changeOrderStatus({
      orderStatusId, ...args
    } = {}) {
      return this.app.put({
        path: `/order_statuses/${orderStatusId}`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      changeOrderStatus,
      orderStatusId,
      name,
      isOpen,
      isDeclined,
      isCancelled,
      isShipped,
      color,
      emailTemplateId,
      isFullyRefunded,
      isPartiallyRefunded,
      isQuoteStatus,
      isPartiallyShipped,
    } = this;

    const response = await changeOrderStatus({
      $,
      orderStatusId,
      data: {
        name,
        is_open: isOpen,
        is_declined: isDeclined,
        is_cancelled: isCancelled,
        is_shipped: isShipped,
        color,
        email_template_id: emailTemplateId,
        is_fully_refunded: isFullyRefunded,
        is_partially_refunded: isPartiallyRefunded,
        is_quote_status: isQuoteStatus,
        is_partially_shipped: isPartiallyShipped,
      },
    });
    $.export("$summary", `Successfully changed the order status with ID \`${response.id}\`.`);
    return response;
  },
};
