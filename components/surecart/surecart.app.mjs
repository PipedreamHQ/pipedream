import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "surecart",
  propDefinitions: {
    customerId: {
      type: "string",
      label: "Customer ID",
      description: "The unique identifier of the customer. Use **List Customers** to retrieve a list of available customers.",
    },
    productId: {
      type: "string",
      label: "Product ID",
      description: "The unique identifier of the product. Use **List Products** to retrieve a list of available products.",
    },
    abandonedCheckoutId: {
      type: "string",
      label: "Abandoned Checkout ID",
      description: "The unique identifier of the abandoned checkout. Use **List Abandoned Checkouts** to retrieve a list of available abandoned checkouts.",
    },
    checkoutId: {
      type: "string",
      label: "Checkout ID",
      description: "The unique identifier of the checkout. Use **List Checkouts** to retrieve a list of available checkouts.",
    },
    invoiceId: {
      type: "string",
      label: "Invoice ID",
      description: "The unique identifier of the invoice. Use **List Invoices** to retrieve a list of available invoices.",
    },
    lineItemId: {
      type: "string",
      label: "Line Item ID",
      description: "The unique identifier of the line item. Use **List Line Items** to retrieve a list of available line items.",
    },
    orderId: {
      type: "string",
      label: "Order ID",
      description: "The unique identifier of the order. Use **List Orders** to retrieve a list of available orders.",
    },
    purchaseId: {
      type: "string",
      label: "Purchase ID",
      description: "The unique identifier of the purchase. Use **List Purchases** to retrieve a list of available purchases.",
    },
    refundItemId: {
      type: "string",
      label: "Refund Item ID",
      description: "The unique identifier of the refund item. Use **List Refund Items** to retrieve a list of available refund items.",
    },
    refundId: {
      type: "string",
      label: "Refund ID",
      description: "The unique identifier of the refund. Use **List Refunds** to retrieve a list of available refunds.",
    },
    cancellationActId: {
      type: "string",
      label: "Cancellation Act ID",
      description: "The unique identifier of the cancellation act. Use **List Cancellation Acts** to retrieve a list of available cancellation acts.",
    },
    cancellationReasonId: {
      type: "string",
      label: "Cancellation Reason ID",
      description: "The unique identifier of the cancellation reason. Use **List Cancellation Reasons** to retrieve a list of available cancellation reasons.",
    },
    periodId: {
      type: "string",
      label: "Period ID",
      description: "The unique identifier of the period. Use **List Periods** to retrieve a list of available periods.",
    },
    subscriptionId: {
      type: "string",
      label: "Subscription ID",
      description: "The unique identifier of the subscription. Use **List Subscriptions** to retrieve a list of available subscriptions.",
    },
    fulfillmentId: {
      type: "string",
      label: "Fulfillment ID",
      description: "The unique identifier of the fulfillment. Use **List Fulfillments** to retrieve a list of available fulfillments.",
    },
    returnRequestId: {
      type: "string",
      label: "Return Request ID",
      description: "The unique identifier of the return request. Use **List Return Requests** to retrieve a list of available return requests.",
    },
    shipmentId: {
      type: "string",
      label: "Shipment ID",
      description: "The unique identifier of the shipment. Use **List Shipments** to retrieve a list of available shipments.",
    },
    trackingId: {
      type: "string",
      label: "Tracking ID",
      description: "The unique identifier of the tracking record. Use **List Trackings** to retrieve a list of available tracking records.",
    },
    ids: {
      type: "string[]",
      label: "IDs",
      description: "Filter by specific IDs. Example: `[\"id_abc123\", \"id_def456\"]`",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Number of results to return per page (1-100). Example: `25`",
      optional: true,
    },
    liveMode: {
      type: "boolean",
      label: "Live Mode",
      description: "Filter by live mode (`true`) or test mode (`false`).",
      optional: true,
    },
    page: {
      type: "integer",
      label: "Page",
      description: "Page number for pagination. Example: `1`",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.surecart.com/v1";
    },
    _makeRequest({
      $ = this, path, headers, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.secret_token}`,
        },
        ...opts,
      });
    },
    createWebhook(opts = {}) {
      return this._makeRequest({
        path: "/webhook_endpoints",
        method: "POST",
        ...opts,
      });
    },
    deleteWebhook({
      webhookId, ...opts
    }) {
      return this._makeRequest({
        path: `/webhook_endpoints/${webhookId}`,
        method: "DELETE",
        ...opts,
      });
    },
    listCustomers(opts = {}) {
      return this._makeRequest({
        path: "/customers",
        ...opts,
      });
    },
    createCustomer(opts = {}) {
      return this._makeRequest({
        path: "/customers",
        method: "POST",
        ...opts,
      });
    },
    getCustomer({
      customerId, ...opts
    }) {
      return this._makeRequest({
        path: `/customers/${customerId}`,
        ...opts,
      });
    },
    deleteCustomer({
      customerId, ...opts
    }) {
      return this._makeRequest({
        path: `/customers/${customerId}`,
        method: "DELETE",
        ...opts,
      });
    },
    updateCustomer({
      customerId, ...opts
    }) {
      return this._makeRequest({
        path: `/customers/${customerId}`,
        method: "PATCH",
        ...opts,
      });
    },
    exposeCustomerMedia({
      customerId, mediaId, ...opts
    }) {
      return this._makeRequest({
        path: `/customers/${customerId}/expose/${mediaId}`,
        ...opts,
      });
    },
    listMedia(opts = {}) {
      return this._makeRequest({
        path: "/medias",
        ...opts,
      });
    },
    createMedia(opts = {}) {
      return this._makeRequest({
        path: "/medias",
        method: "POST",
        ...opts,
      });
    },
    listPrices(opts = {}) {
      return this._makeRequest({
        path: "/prices",
        ...opts,
      });
    },
    createPrice(opts = {}) {
      return this._makeRequest({
        path: "/prices",
        method: "POST",
        ...opts,
      });
    },
    listProducts(opts = {}) {
      return this._makeRequest({
        path: "/products",
        ...opts,
      });
    },
    getProduct({
      productId, ...opts
    }) {
      return this._makeRequest({
        path: `/products/${productId}`,
        ...opts,
      });
    },
    listAbandonedCheckouts(opts = {}) {
      return this._makeRequest({
        path: "/abandoned_checkouts",
        ...opts,
      });
    },
    getAbandonedCheckout({
      abandonedCheckoutId, ...opts
    }) {
      return this._makeRequest({
        path: `/abandoned_checkouts/${abandonedCheckoutId}`,
        ...opts,
      });
    },
    listCharges(opts = {}) {
      return this._makeRequest({
        path: "/charges",
        ...opts,
      });
    },
    listCheckouts(opts = {}) {
      return this._makeRequest({
        path: "/checkouts",
        ...opts,
      });
    },
    getCheckout({
      checkoutId, ...opts
    }) {
      return this._makeRequest({
        path: `/checkouts/${checkoutId}`,
        ...opts,
      });
    },
    listInvoices(opts = {}) {
      return this._makeRequest({
        path: "/invoices",
        ...opts,
      });
    },
    getInvoice({
      invoiceId, ...opts
    }) {
      return this._makeRequest({
        path: `/invoices/${invoiceId}`,
        ...opts,
      });
    },
    listLineItems(opts = {}) {
      return this._makeRequest({
        path: "/line_items",
        ...opts,
      });
    },
    getLineItem({
      lineItemId, ...opts
    }) {
      return this._makeRequest({
        path: `/line_items/${lineItemId}`,
        ...opts,
      });
    },
    listOrders(opts = {}) {
      return this._makeRequest({
        path: "/orders",
        ...opts,
      });
    },
    getOrder({
      orderId, ...opts
    }) {
      return this._makeRequest({
        path: `/orders/${orderId}`,
        ...opts,
      });
    },
    listPurchases(opts = {}) {
      return this._makeRequest({
        path: "/purchases",
        ...opts,
      });
    },
    getPurchase({
      purchaseId, ...opts
    }) {
      return this._makeRequest({
        path: `/purchases/${purchaseId}`,
        ...opts,
      });
    },
    listRefundItems(opts = {}) {
      return this._makeRequest({
        path: "/refund_items",
        ...opts,
      });
    },
    getRefundItem({
      refundItemId, ...opts
    }) {
      return this._makeRequest({
        path: `/refund_items/${refundItemId}`,
        ...opts,
      });
    },
    listRefunds(opts = {}) {
      return this._makeRequest({
        path: "/refunds",
        ...opts,
      });
    },
    getRefund({
      refundId, ...opts
    }) {
      return this._makeRequest({
        path: `/refunds/${refundId}`,
        ...opts,
      });
    },
    listCancellationActs(opts = {}) {
      return this._makeRequest({
        path: "/cancellation_acts",
        ...opts,
      });
    },
    getCancellationAct({
      cancellationActId, ...opts
    }) {
      return this._makeRequest({
        path: `/cancellation_acts/${cancellationActId}`,
        ...opts,
      });
    },
    listCancellationReasons(opts = {}) {
      return this._makeRequest({
        path: "/cancellation_reasons",
        ...opts,
      });
    },
    getCancellationReason({
      cancellationReasonId, ...opts
    }) {
      return this._makeRequest({
        path: `/cancellation_reasons/${cancellationReasonId}`,
        ...opts,
      });
    },
    listPeriods(opts = {}) {
      return this._makeRequest({
        path: "/periods",
        ...opts,
      });
    },
    getSubscriptionProtocol(opts = {}) {
      return this._makeRequest({
        path: "/subscription_protocol",
        ...opts,
      });
    },
    listSubscriptions(opts = {}) {
      return this._makeRequest({
        path: "/subscriptions",
        ...opts,
      });
    },
    getSubscription({
      subscriptionId, ...opts
    }) {
      return this._makeRequest({
        path: `/subscriptions/${subscriptionId}`,
        ...opts,
      });
    },
    listFulfillments(opts = {}) {
      return this._makeRequest({
        path: "/fulfillments",
        ...opts,
      });
    },
    getFulfillment({
      fulfillmentId, ...opts
    }) {
      return this._makeRequest({
        path: `/fulfillments/${fulfillmentId}`,
        ...opts,
      });
    },
    listReturnRequests(opts = {}) {
      return this._makeRequest({
        path: "/return_requests",
        ...opts,
      });
    },
    getReturnRequest({
      returnRequestId, ...opts
    }) {
      return this._makeRequest({
        path: `/return_requests/${returnRequestId}`,
        ...opts,
      });
    },
    listShipments(opts = {}) {
      return this._makeRequest({
        path: "/shipments",
        ...opts,
      });
    },
    getShipment({
      shipmentId, ...opts
    }) {
      return this._makeRequest({
        path: `/shipments/${shipmentId}`,
        ...opts,
      });
    },
    listTrackings(opts = {}) {
      return this._makeRequest({
        path: "/trackings",
        ...opts,
      });
    },
    getTracking({
      trackingId, ...opts
    }) {
      return this._makeRequest({
        path: `/trackings/${trackingId}`,
        ...opts,
      });
    },
    createRefund(opts = {}) {
      return this._makeRequest({
        path: "/refunds",
        method: "POST",
        ...opts,
      });
    },
    createReturnRequest(opts = {}) {
      return this._makeRequest({
        path: "/return_requests",
        method: "POST",
        ...opts,
      });
    },
    updateReturnRequest({
      returnRequestId, ...opts
    }) {
      return this._makeRequest({
        path: `/return_requests/${returnRequestId}`,
        method: "PATCH",
        ...opts,
      });
    },
    deleteReturnRequest({
      returnRequestId, ...opts
    }) {
      return this._makeRequest({
        path: `/return_requests/${returnRequestId}`,
        method: "DELETE",
        ...opts,
      });
    },
    updateShipment({
      shipmentId, ...opts
    }) {
      return this._makeRequest({
        path: `/shipments/${shipmentId}`,
        method: "PATCH",
        ...opts,
      });
    },
    createFulfillment(opts = {}) {
      return this._makeRequest({
        path: "/fulfillments",
        method: "POST",
        ...opts,
      });
    },
    updateFulfillment({
      fulfillmentId, ...opts
    }) {
      return this._makeRequest({
        path: `/fulfillments/${fulfillmentId}`,
        method: "PATCH",
        ...opts,
      });
    },
    deleteFulfillment({
      fulfillmentId, ...opts
    }) {
      return this._makeRequest({
        path: `/fulfillments/${fulfillmentId}`,
        method: "DELETE",
        ...opts,
      });
    },
    createInvoice(opts = {}) {
      return this._makeRequest({
        path: "/invoices",
        method: "POST",
        ...opts,
      });
    },
    createLineItem(opts = {}) {
      return this._makeRequest({
        path: "/line_items",
        method: "POST",
        ...opts,
      });
    },
    updateLineItem({
      lineItemId, ...opts
    }) {
      return this._makeRequest({
        path: `/line_items/${lineItemId}`,
        method: "PATCH",
        ...opts,
      });
    },
    createSubscription(opts = {}) {
      return this._makeRequest({
        path: "/subscriptions",
        method: "POST",
        ...opts,
      });
    },
    updateSubscription({
      subscriptionId, ...opts
    }) {
      return this._makeRequest({
        path: `/subscriptions/${subscriptionId}`,
        method: "PATCH",
        ...opts,
      });
    },
    updatePurchase({
      purchaseId, ...opts
    }) {
      return this._makeRequest({
        path: `/purchases/${purchaseId}`,
        method: "PATCH",
        ...opts,
      });
    },
    createCheckout(opts = {}) {
      return this._makeRequest({
        path: "/checkouts",
        method: "POST",
        ...opts,
      });
    },
    updateCheckout({
      checkoutId, ...opts
    }) {
      return this._makeRequest({
        path: `/checkouts/${checkoutId}`,
        method: "PATCH",
        ...opts,
      });
    },
  },
};
