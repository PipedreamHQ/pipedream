import commonApp from "@pipedream/shopify";
import Shopify from "shopify-api-node";
import queries from "./common/queries.mjs";
import mutations from "./common/mutations.mjs";
import {
  API_VERSION, MAX_LIMIT,
} from "@pipedream/shopify/common/constants.mjs";

export default {
  ...commonApp,
  type: "app",
  app: "shopify_developer_app",
  propDefinitions: {
    ...commonApp.propDefinitions,
    orderId: {
      type: "string",
      label: "Order ID",
      description: "The identifier of an order",
      async options({ prevContext }) {
        return this.getPropOptions({
          resourceFn: this.listOrders,
          resourceKeys: [
            "orders",
          ],
          labelKey: "id",
          prevContext,
        });
      },
    },
    customerId: {
      type: "string",
      label: "Customer ID",
      description: "The identifier of a customer",
      async options({ prevContext }) {
        return this.getPropOptions({
          resourceFn: this.listCustomers,
          resourceKeys: [
            "customers",
          ],
          labelKey: "displayName",
          prevContext,
        });
      },
    },
    lineItemIds: {
      type: "string[]",
      label: "Line Item IDs",
      description: "An array of line item IDs",
      async options({ orderId }) {
        const order = await this.getOrder({
          id: orderId,
          first: MAX_LIMIT,
        });
        return order.order.lineItems.edges.map(({ node }) => ({
          label: node.title,
          value: node.id,
        }));
      },
    },
    fulfillmentId: {
      type: "string",
      label: "Fulfillment ID",
      description: "The identifier of a fulfillment",
      async options({ orderId }) {
        const order = await this.getOrder({
          id: orderId,
          first: MAX_LIMIT,
        });
        return order.order.fulfillments?.map(({ id }) => id) ?? [];
      },
    },
    fulfillmentOrderId: {
      type: "string",
      label: "Fulfillment Order ID",
      description: "The identifier of a fulfillment order",
      async options({ prevContext }) {
        return this.getPropOptions({
          resourceFn: this.listFulfillmentOrders,
          resourceKeys: [
            "fulfillmentOrders",
          ],
          labelKey: "id",
          prevContext,
        });
      },
    },
    fulfillmentOrderLineItemIds: {
      type: "string[]",
      label: "Fulfillment Order Line Item IDs",
      description: "An array of fulfillment order line item IDs",
      async options({ fulfillmentOrderId }) {
        const fulfillmentOrder = await this.getFulfillmentOrder({
          fulfillmentOrderId,
          first: MAX_LIMIT,
        });
        return fulfillmentOrder.fulfillmentOrder.lineItems.nodes.map(({ id }) => id);
      },
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The customer's first name",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The customer's last name",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "The unique email address of the customer",
    },
    phone: {
      type: "string",
      label: "Phone Number",
      description: "The unique phone number (E.164 format) for this customer. Check out [Shopify Customer API](https://shopify.dev/api/admin-rest/2022-01/resources/customer#[post]/admin/api/#{api_version}/customers.json_examples) for more details on valid formats",
      optional: true,
    },
    address: {
      type: "string",
      label: "Street Address",
      description: "The customer's mailing address",
      optional: true,
    },
    company: {
      type: "string",
      label: "Company",
      description: "The customer's company",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "The customer's city, town, or village",
      optional: true,
    },
    province: {
      type: "string",
      label: "Province",
      description: "The customer's region name. Typically a province, a state, or a prefecture",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "The customer's country",
      optional: true,
    },
    zip: {
      type: "string",
      label: "Zip Code",
      description: "The customer's postal code",
      optional: true,
    },
    metafields: {
      type: "string[]",
      label: "Metafields",
      description: "An array of objects, each one representing a metafield. If adding a new metafield, the object should contain `key`, `value`, `type`, and `namespace`. Example: `{{ [{ \"key\": \"new\", \"value\": \"newvalue\", \"type\": \"single_line_text_field\", \"namespace\": \"global\" }] }}`. To update an existing metafield, use the `id` and `value`. Example: `{{ [{ \"id\": \"28408051400984\", \"value\": \"updatedvalue\" }] }}`",
      optional: true,
    },
  },
  methods: {
    ...commonApp.methods,
    getShopifyInstance() {
      return new Shopify({
        shopName: this.getShopId(),
        accessToken: this.$auth.access_token,
        autoLimit: true,
        apiVersion: API_VERSION,
      });
    },
    getOrder(variables) {
      return this._makeGraphQlRequest(queries.GET_ORDER, variables);
    },
    getDraftOrder(variables) {
      return this._makeGraphQlRequest(queries.GET_DRAFT_ORDER, variables);
    },
    getFulfillmentOrder(variables) {
      return this._makeGraphQlRequest(queries.GET_FULFILLMENT_ORDER, variables);
    },
    getCustomer(variables) {
      return this._makeGraphQlRequest(queries.GET_CUSTOMER, variables);
    },
    listOrders(variables) {
      return this._makeGraphQlRequest(queries.LIST_ORDERS, variables);
    },
    listDraftOrders(variables) {
      return this._makeGraphQlRequest(queries.LIST_DRAFT_ORDERS, variables);
    },
    listCustomers(variables) {
      return this._makeGraphQlRequest(queries.LIST_CUSTOMERS, variables);
    },
    listFulfillmentOrders(variables) {
      return this._makeGraphQlRequest(queries.LIST_FULFILLMENT_ORDERS, variables);
    },
    createOrder(variables) {
      return this._makeGraphQlRequest(mutations.CREATE_ORDER, variables);
    },
    createCustomer(variables) {
      return this._makeGraphQlRequest(mutations.CREATE_CUSTOMER, variables);
    },
    createFulfillment(variables) {
      return this._makeGraphQlRequest(mutations.CREATE_FULFILLMENT, variables);
    },
    updateCustomer(variables) {
      return this._makeGraphQlRequest(mutations.UPDATE_CUSTOMER, variables);
    },
    refundOrder(variables) {
      return this._makeGraphQlRequest(mutations.REFUND_ORDER, variables);
    },
    updateFulfillmentTrackingInfo(variables) {
      return this._makeGraphQlRequest(mutations.UPDATE_FULFILLMENT_TRACKING_INFO, variables);
    },
  },
};
