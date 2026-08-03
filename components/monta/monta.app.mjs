import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "monta",
  propDefinitions: {
    orderId: {
      type: "string",
      label: "Order ID",
      description: "The ID of an order. Use the **List Order ID Options** action to discover order IDs.",
      async options({ page }) {
        const orders = await this.listOrders({
          params: {
            page,
          },
        });
        return orders.map(({ WebshopOrderId: id }) => ({
          label: `Order ID: ${id}`,
          value: id,
        }));
      },
    },
    returnId: {
      type: "string",
      label: "Return ID",
      description: "The ID of a return. Use the **List Order Returns** action to discover return IDs.",
      async options({ orderId }) {
        const { Returns: returns } = await this.listReturns({
          orderId,
        });
        return returns.map(({ Id: id }) => ({
          label: `Return ID: ${id}`,
          value: id,
        }));
      },
    },
    reference: {
      type: "string",
      label: "Reference",
      description: "The reference of the inbound forecast group (e.g. `PO-12345`). Use the **List Inbound Forecast Groups** action to find available references.",
    },
    sku: {
      type: "string",
      label: "SKU",
      description: "A product SKU (e.g. `ABC-123`)",
    },
    inboundForecasts: {
      type: "string[]",
      label: "Inbound Forecasts",
      description: "The forecasts in the group. Each entry is a JSON object with `Sku`, `Quantity`, and a `DeliveryDate` (ISO 8601), e.g. `{\"Sku\":\"ABC-123\",\"Quantity\":10,\"DeliveryDate\":\"2026-07-31T00:00:00Z\"}`",
    },
    supplierCode: {
      type: "string",
      label: "Supplier Code",
      description: "The code of the supplier delivering this inbound",
    },
    comment: {
      type: "string",
      label: "Comment",
      description: "A comment for the inbound forecast group",
    },
    warehouseDisplayName: {
      type: "string",
      label: "Warehouse Display Name",
      description: "The display name of the warehouse the inbound is expected at",
    },
    allocateStockOnDelivery: {
      type: "boolean",
      label: "Allocate Stock On Delivery",
      description: "Whether to allocate stock to backorders on delivery",
    },
    expectedDeliveryDate: {
      type: "string",
      label: "Expected Delivery Date",
      description: "The expected delivery date in ISO 8601 format (e.g. `2026-07-24T14:30:00Z`)",
    },
    street: {
      type: "string",
      label: "Street",
      description: "The street name",
    },
    houseNumber: {
      type: "string",
      label: "House Number",
      description: "The house number",
    },
    houseNumberAddition: {
      type: "string",
      label: "House Number Addition",
      description: "An addition to the house number",
    },
    postalCode: {
      type: "string",
      label: "Postal Code",
      description: "The postal code",
    },
    city: {
      type: "string",
      label: "City",
      description: "The city",
    },
    state: {
      type: "string",
      label: "State",
      description: "The state or province",
    },
    countryCode: {
      type: "string",
      label: "Country Code",
      description: "The ISO 3166-1 alpha-2 country code (e.g. `NL`)",
    },
    company: {
      type: "string",
      label: "Company",
      description: "The company name",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The recipient's first name",
    },
    middleName: {
      type: "string",
      label: "Middle Name",
      description: "The recipient's middle name",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The recipient's last name",
    },
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "The recipient's phone number",
    },
    emailAddress: {
      type: "string",
      label: "Email Address",
      description: "The recipient's email address",
    },
    additionalFields: {
      type: "object",
      label: "Additional Fields",
      description: "Additional properties to merge into the request body, using Monta's PascalCase request-body casing (e.g. `{ \"Origin\": \"Webshop\" }`). Explicit props above take precedence over keys set here.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api-v6.monta.nl";
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        ...opts,
        url: `${this._baseUrl()}${path}`,
        auth: {
          username: this.$auth.username,
          password: this.$auth.password,
        },
      });
    },
    getOrder({
      orderId, ...opts
    }) {
      return this._makeRequest({
        path: `/order/${encodeURIComponent(orderId)}`,
        ...opts,
      });
    },
    getReturn({
      returnId, ...opts
    }) {
      return this._makeRequest({
        path: `/return/${encodeURIComponent(returnId)}`,
        ...opts,
      });
    },
    listOrders(opts = {}) {
      return this._makeRequest({
        path: "/orders",
        ...opts,
      });
    },
    listReturns({
      orderId, ...opts
    }) {
      return this._makeRequest({
        path: `/order/${encodeURIComponent(orderId)}/return`,
        ...opts,
      });
    },
    listOrderEvents({
      orderId, ...opts
    }) {
      return this._makeRequest({
        path: `/order/${encodeURIComponent(orderId)}/events`,
        ...opts,
      });
    },
    /**
     * Lists products whose stock changed since the provided date and time.
     *
     * @param {object} args - Request arguments
     * @param {string} args.updatedSince - ISO 8601 start date and time
     * @returns {Promise<object>} The Monta response containing updated products
     */
    listProductStockChanges({
      updatedSince, ...opts
    }) {
      return this._makeRequest({
        ...opts,
        path: `/product/updated_since/${encodeURIComponent(updatedSince)}`,
      });
    },
    /**
     * Lists inbound shipments expected at the warehouse.
     *
     * @param {object} [opts] - Request options (e.g. `params.sinceid`)
     * @returns {Promise<Array>} The list of inbounds
     */
    listInbounds(opts = {}) {
      return this._makeRequest({
        path: "/inbounds",
        ...opts,
      });
    },
    /**
     * Lists inbound forecast groups matching the provided filters.
     *
     * @param {object} [opts] - Request options (query filters under `params`)
     * @returns {Promise<Array>} The list of inbound forecast groups
     */
    listInboundForecastGroups(opts = {}) {
      return this._makeRequest({
        path: "/inboundforecast/group",
        ...opts,
      });
    },
    /**
     * Creates a new inbound forecast group.
     *
     * @param {object} opts - Request options (`data` holds the group payload)
     * @returns {Promise<object>} The created inbound forecast group
     */
    createInboundForecastGroup(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/inboundforecast/group",
        ...opts,
      });
    },
    /**
     * Retrieves a single inbound forecast group by its reference.
     *
     * @param {object} args - Request arguments
     * @param {string} args.reference - The inbound forecast group reference
     * @returns {Promise<object>} The inbound forecast group
     */
    getInboundForecastGroup({
      reference, ...opts
    }) {
      return this._makeRequest({
        path: `/inboundforecast/group/${encodeURIComponent(reference)}`,
        ...opts,
      });
    },
    /**
     * Updates an existing inbound forecast group by its reference.
     *
     * @param {object} args - Request arguments
     * @param {string} args.reference - The inbound forecast group reference
     * @returns {Promise<object>} The updated inbound forecast group
     */
    updateInboundForecastGroup({
      reference, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/inboundforecast/group/${encodeURIComponent(reference)}`,
        ...opts,
      });
    },
    /**
     * Deletes an inbound forecast group (or a single SKU within it).
     *
     * @param {object} args - Request arguments
     * @param {string} args.reference - The inbound forecast group reference
     * @returns {Promise<void>} Empty response on success
     */
    deleteInboundForecastGroup({
      reference, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/inboundforecast/group/${encodeURIComponent(reference)}`,
        ...opts,
      });
    },
    /**
     * Retrieves a single inbound forecast by group reference and SKU.
     *
     * @param {object} args - Request arguments
     * @param {string} args.reference - The inbound forecast group reference
     * @param {string} args.sku - The product SKU
     * @returns {Promise<object>} The inbound forecast
     */
    getInboundForecast({
      reference, sku, ...opts
    }) {
      return this._makeRequest({
        path: `/inboundforecast/group/${encodeURIComponent(reference)}/${encodeURIComponent(sku)}`,
        ...opts,
      });
    },
    /**
     * Lists all inbound forecasts for a given product SKU.
     *
     * @param {object} args - Request arguments
     * @param {string} args.productSku - The product SKU
     * @returns {Promise<Array>} The list of inbound forecasts
     */
    listInboundForecastsByProductSku({
      productSku, ...opts
    }) {
      return this._makeRequest({
        path: `/inboundforecast/group/byproductsku/${encodeURIComponent(productSku)}`,
        ...opts,
      });
    },
    /**
     * Approves multiple inbound forecasts by their IDs.
     *
     * @param {object} opts - Request options (`data` is an array of IDs)
     * @returns {Promise<boolean>} Whether the approval succeeded
     */
    approveInboundForecasts(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/inboundforecast/approve",
        ...opts,
      });
    },
    /**
     * Lists inbound forecast events created after the provided event ID.
     *
     * @param {object} args - Request arguments
     * @param {number} args.id - The event ID to fetch events after
     * @returns {Promise<Array>} The list of inbound forecast events
     */
    listInboundForecastEvents({
      id, ...opts
    }) {
      return this._makeRequest({
        path: `/inboundforecast/events/since_id/${id}`,
        ...opts,
      });
    },
    /**
     * Creates a new order.
     *
     * @param {object} opts - Request options (`data` holds the order payload)
     * @returns {Promise<object>} The created order
     */
    createOrder(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/order",
        ...opts,
      });
    },
    /**
     * Updates an existing order (e.g. to change the delivery address).
     *
     * @param {object} args - Request arguments
     * @param {string} args.orderId - The webshop order ID
     * @returns {Promise<object>} The updated order
     */
    updateOrder({
      orderId, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/order/${encodeURIComponent(orderId)}`,
        ...opts,
      });
    },
    /**
     * Cancels (deletes) an order.
     *
     * @param {object} args - Request arguments
     * @param {string} args.orderId - The webshop order ID
     * @returns {Promise<void>} Empty response on success
     */
    cancelOrder({
      orderId, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/order/${encodeURIComponent(orderId)}`,
        ...opts,
      });
    },
    /**
     * Validates a delivery address.
     *
     * @param {object} opts - Request options (`data` holds the address payload)
     * @returns {Promise<void>} Empty response when the address is valid
     */
    validateAddress(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/address",
        ...opts,
      });
    },
    /**
     * Anonymizes (forgets) an order for GDPR erasure.
     *
     * @param {object} args - Request arguments
     * @param {string} args.orderId - The webshop order ID
     * @returns {Promise<void>} Empty response on success
     */
    forgetOrder({
      orderId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/order/${encodeURIComponent(orderId)}/forget`,
        ...opts,
      });
    },
    /**
     * Lists the colli (parcels) of an order.
     *
     * @param {object} args - Request arguments
     * @param {string} args.orderId - The webshop order ID
     * @returns {Promise<object>} The order colli details
     */
    listOrderColli({
      orderId, ...opts
    }) {
      return this._makeRequest({
        path: `/order/${encodeURIComponent(orderId)}/colli`,
        ...opts,
      });
    },
    /**
     * Adds a collo (parcel) to an order.
     *
     * @param {object} args - Request arguments
     * @param {string} args.orderId - The webshop order ID
     * @returns {Promise<object>} The created collo
     */
    createOrderColli({
      orderId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/order/${encodeURIComponent(orderId)}/colli`,
        ...opts,
      });
    },
    /**
     * Lists the shipping labels of an order.
     *
     * @param {object} args - Request arguments
     * @param {string} args.orderId - The webshop order ID
     * @returns {Promise<Array>} The list of shipping labels
     */
    listShippingLabels({
      orderId, ...opts
    }) {
      return this._makeRequest({
        path: `/order/${encodeURIComponent(orderId)}/shippinglabels`,
        ...opts,
      });
    },
    /**
     * Creates a shipping label for an order.
     *
     * @param {object} args - Request arguments
     * @param {string} args.orderId - The webshop order ID
     * @returns {Promise<Array>} The created shipping labels
     */
    createShippingLabel({
      orderId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/order/${encodeURIComponent(orderId)}/shippinglabels`,
        ...opts,
      });
    },
    /**
     * Downloads a single shipping label file for an order.
     *
     * @param {object} args - Request arguments
     * @param {string} args.orderId - The webshop order ID
     * @param {string} args.filename - The shipping label file name
     * @returns {Promise<Buffer>} The shipping label file contents
     */
    downloadShippingLabel({
      orderId, filename, ...opts
    }) {
      return this._makeRequest({
        path: `/order/${encodeURIComponent(orderId)}/shippinglabels/${encodeURIComponent(filename)}`,
        ...opts,
      });
    },
    /**
     * Lists the batches of an order.
     *
     * @param {object} args - Request arguments
     * @param {string} args.orderId - The webshop order ID
     * @returns {Promise<object>} The order batch details
     */
    listOrderBatches({
      orderId, ...opts
    }) {
      return this._makeRequest({
        path: `/order/${encodeURIComponent(orderId)}/batches`,
        ...opts,
      });
    },
    /**
     * Lists orders whose status changed since the provided date and time.
     *
     * @param {object} args - Request arguments
     * @param {string} args.updatedSince - ISO 8601 start date and time
     * @returns {Promise<object>} The Monta response containing updated orders
     */
    listUpdatedOrders({
      updatedSince, ...opts
    }) {
      return this._makeRequest({
        path: `/order/updated_since/${encodeURIComponent(updatedSince)}`,
        ...opts,
      });
    },
    /**
     * Lists order events created after the provided event ID.
     *
     * @param {object} args - Request arguments
     * @param {number} args.id - The event ID to fetch events after
     * @returns {Promise<Array>} The list of order events
     */
    listOrderEventsSinceId({
      id, ...opts
    }) {
      return this._makeRequest({
        path: `/orderevents/since_id/${id}`,
        ...opts,
      });
    },
    /**
     * Lists the return forecasts of an order.
     *
     * @param {object} args - Request arguments
     * @param {string} args.orderId - The webshop order ID
     * @returns {Promise<Array>} The list of return forecasts
     */
    listReturnForecasts({
      orderId, ...opts
    }) {
      return this._makeRequest({
        path: `/order/${encodeURIComponent(orderId)}/returnforecasts`,
        ...opts,
      });
    },
    /**
     * Lists the return labels of an order.
     *
     * @param {object} args - Request arguments
     * @param {string} args.orderId - The webshop order ID
     * @returns {Promise<Array>} The list of return labels
     */
    listReturnLabels({
      orderId, ...opts
    }) {
      return this._makeRequest({
        path: `/order/${encodeURIComponent(orderId)}/returnlabels`,
        ...opts,
      });
    },
    /**
     * Creates an RMA link for an order.
     *
     * @param {object} args - Request arguments
     * @param {string} args.orderId - The webshop order ID
     * @returns {Promise<object>} The created RMA link
     */
    createRmaLink({
      orderId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/order/${encodeURIComponent(orderId)}/rmalinks`,
        ...opts,
      });
    },
  },
};
