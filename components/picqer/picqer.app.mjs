import { axios } from "@pipedream/platform";
import {
  LANGUAGE_OPTIONS,
  LIMIT,
} from "./common/constants.mjs";

export default {
  type: "app",
  app: "picqer",
  propDefinitions: {
    orderId: {
      type: "string",
      label: "Order ID",
      description: "The order id for searching orders.",
      async options({
        page, params,
      }) {
        const data = await this.searchOrders({
          params: {
            offset: page * LIMIT,
            ...params,
          },
        });

        return data.map(({
          idorder: value, invoicename: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    customerId: {
      type: "string",
      label: "Customer ID",
      description: "The customer id for creating a new order.",
      async options({ page }) {
        const data = await this.listCustomers({
          params: {
            offset: page * LIMIT,
          },
        });

        return data.map(({
          idcustomer: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    templateId: {
      type: "string",
      label: "Template Id",
      description: "The template id for creating a new order.",
      async options({ page }) {
        const data = await this.listTemplates({
          params: {
            offset: page * LIMIT,
          },
        });

        return data.map(({
          idtemplate: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    shippingProviderId: {
      type: "string",
      label: "Shipping Provider Id",
      description: "The shipping provider id for creating a new order.",
      async options({ page }) {
        const data = await this.listShippingProviders({
          params: {
            offset: page * LIMIT,
          },
        });
        return data.map(({
          idshippingprovider: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    warehouseId: {
      type: "string",
      label: "Warehouse ID",
      description: "Warehouses that can be used to fulfil this order.",
      async options({ page }) {
        const warehouses = await this.listWarehouses({
          params: {
            offset: page * LIMIT,
          },
        });
        return warehouses.map(({
          idwarehouse: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    fulfillmentCustomerId: {
      type: "string",
      label: "Fulfillment Customer ID",
      description: "Fulfillment customer for this order.",
      async options({ page }) {
        const fulfillmentCustomers = await this.listFulfillmentCustomers({
          params: {
            offset: page * LIMIT,
          },
        });
        return fulfillmentCustomers.map(({
          idcustomer: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    returnId: {
      type: "string",
      label: "Return ID",
      description: "The return id for searching returns.",
      async options({ page }) {
        const data = await this.searchReturns({
          params: {
            offset: page * LIMIT,
          },
        });

        return data.map(({
          idreturn: value, returnid, name,
        }) => ({
          label: `${returnid} - ${name}`,
          value,
        }));
      },
    },
    picklistId: {
      type: "string",
      label: "Picklist ID",
      description: "The picklist id for searching picklists.",
      async options({ page }) {
        const data = await this.listPicklists({
          params: {
            offset: page * LIMIT,
          },
        });
        return data.map(({
          idpicklist: value, picklistid, deliveryname,
        }) => ({
          label: `${picklistid} - ${deliveryname}`,
          value,
        }));
      },
    },
    deliveryName: {
      type: "string",
      label: "Delivery Name",
      description: "Name of delivery address. Required if **Customer Id** is not provided.",
    },
    deliveryContactName: {
      type: "string",
      label: "Delivery Contact Name",
      description: "Contact name of delivery address.",
    },
    deliveryAddress: {
      type: "string",
      label: "Delivery Address",
      description: "Address line of delivery address.",
    },
    deliveryAddress2: {
      type: "string",
      label: "Delivery Address 2",
      description: "Second address line. Not accepted by all shipping providers.",
    },
    deliveryZipcode: {
      type: "string",
      label: "Delivery Zipcode",
      description: "ZIP code of delivery address.",
    },
    deliveryCity: {
      type: "string",
      label: "Delivery City",
      description: "City of delivery address.",
    },
    deliveryRegion: {
      type: "string",
      label: "Delivery Region",
      description: "Region, province or state of delivery address.",
    },
    deliveryCountry: {
      type: "string",
      label: "Delivery Country",
      description: "Country of delivery address (needs to be ISO 3166 2-char code). Required if **Customer Id** is not provided.",
    },
    invoiceName: {
      type: "string",
      label: "Invoice Name",
      description: "Name of invoice address. Required if **Customer Id** is not provided.",
    },
    invoiceContactName: {
      type: "string",
      label: "Invoice Contact Name",
      description: "Contact name of invoice address",
    },
    invoiceAddress: {
      type: "string",
      label: "Invoice Address",
      description: "Address line of invoice address",
    },
    invoiceAddress2: {
      type: "string",
      label: "Invoice Address 2",
      description: "Second address line. Not accepted by all shipping providers.",
    },
    invoiceZipcode: {
      type: "string",
      label: "Invoice Zipcode",
      description: "ZIP code of invoice address",
    },
    invoiceCity: {
      type: "string",
      label: "Invoice City",
      description: "City of invoice address",
    },
    invoiceRegion: {
      type: "string",
      label: "Invoice Region",
      description: "Region, province or state of invoice address",
    },
    invoiceCountry: {
      type: "string",
      label: "Invoice Country",
      description: "Country of invoice address (needs to be ISO 3166 2-char code). Required if **Customer Id** is not provided.",
    },
    telephone: {
      type: "string",
      label: "Telephone",
      description: "Telephone number of the customer.",
    },
    emailAddress: {
      type: "string",
      label: "Email Address",
      description: "Email address of the customer",
    },
    discount: {
      type: "string",
      label: "Discount",
      description: "Discount percentage of order",
    },
    preferredDeliveryDate: {
      type: "string",
      label: "Preferred Delivery Date",
      description: "Customer supplied preferred delivery date, in format **yyyy-mm-dd**.",
    },
    customerRemarks: {
      type: "string",
      label: "Customer Remarks",
      description: "Remarks from the customer, will be printed on picking and packing list",
    },
    reference: {
      type: "string",
      label: "Reference",
      description: "Reference for customer, will be printed on invoice and picking list",
    },
    invoiced: {
      type: "boolean",
      label: "Invoiced",
      description: "If this order is already invoiced, set this to true. This will make sure Picqer will not invoice this order",
    },
    partialDelivery: {
      type: "boolean",
      label: "Partial Delivery",
      description: "If Picqer AutoSplit is enabled, order can be split over multiple picklists over multiple warehouses. If disabled, it will wait for all products to be available",
    },
    language: {
      type: "string",
      label: "Language",
      description: "Language of the order",
      options: LANGUAGE_OPTIONS,
    },
    commentBody: {
      type: "string",
      label: "Comment Body",
      description: "The body of the comment.",
    },
    showAtRelated: {
      type: "boolean",
      label: "Show At Related",
      description: "Whether the comment is visible on related resources. For example: comments added to orders can be shown when retrieving comments for a picklist of that order.",
    },
    isVisibleFulfillment: {
      type: "boolean",
      label: "Visible In Fulfillment",
      description: "Only for Picqer Fulfilment: Whether the comment is visible for the fulfilment customer the resource belongs to.",
    },
    tagId: {
      type: "string",
      label: "Tag ID",
      description: "The tag to associate with the order",
      async options({ page }) {
        const data = await this.listTags({
          params: {
            offset: page * LIMIT,
          },
        });
        return data.map(({
          idtag: value, title: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    productId: {
      type: "string",
      label: "Product ID",
      description: "The product to add to the order",
      async options({ page }) {
        const data = await this.listProducts({
          params: {
            offset: page * LIMIT,
          },
        });
        return data.map(({
          idproduct: value, productcode, name,
        }) => ({
          label: `${productcode} - ${name}`,
          value,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return `https://${this.$auth.subdomain}.picqer.com/api/v1`;
    },
    _auth() {
      return {
        username: `${this.$auth.api_key}`,
        password: "",
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        auth: this._auth(),
        ...opts,
      });
    },
    createOrder(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/orders",
        ...opts,
      });
    },
    updateOrder({
      orderId, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/orders/${orderId}`,
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
    getCustomer({
      customerId, ...opts
    }) {
      return this._makeRequest({
        path: `/customers/${customerId}`,
        ...opts,
      });
    },
    listCustomers(opts = {}) {
      return this._makeRequest({
        path: "/customers",
        ...opts,
      });
    },
    listOrderFields(opts = {}) {
      return this._makeRequest({
        path: "/orderfields",
        ...opts,
      });
    },
    listTemplates(opts = {}) {
      return this._makeRequest({
        path: "/templates",
        ...opts,
      });
    },
    listShippingProviders(opts = {}) {
      return this._makeRequest({
        path: "/shippingproviders",
        ...opts,
      });
    },
    searchOrders(opts = {}) {
      return this._makeRequest({
        path: "/orders",
        ...opts,
      });
    },
    listWarehouses(opts = {}) {
      return this._makeRequest({
        path: "/warehouses",
        ...opts,
      });
    },
    listFulfillmentCustomers(opts = {}) {
      return this._makeRequest({
        path: "/fulfilment/customers",
        ...opts,
      });
    },
    getStatusPerOrderLine({
      orderId, ...opts
    }) {
      return this._makeRequest({
        path: `/orders/${orderId}/productstatus`,
        ...opts,
      });
    },
    addOrderComment({
      orderId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/orders/${orderId}/comments`,
        ...opts,
      });
    },
    addReturnComment({
      returnId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/returns/${returnId}/comments`,
        ...opts,
      });
    },
    searchReturns(opts = {}) {
      return this._makeRequest({
        path: "/returns",
        ...opts,
      });
    },
    listPicklists(opts = {}) {
      return this._makeRequest({
        path: "/picklists",
        ...opts,
      });
    },
    getPicklist({
      picklistId, ...opts
    }) {
      return this._makeRequest({
        path: `/picklists/${picklistId}`,
        ...opts,
      });
    },
    createHook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/hooks",
        ...opts,
      });
    },
    deleteHook(hookId) {
      return this._makeRequest({
        method: "DELETE",
        path: `/hooks/${hookId}`,
      });
    },
    processOrder({
      orderId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/orders/${orderId}/process`,
        ...opts,
      });
    },
    pauseOrder({
      orderId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/orders/${orderId}/pause`,
        ...opts,
      });
    },
    changeOrderToConcept({
      orderId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/orders/${orderId}/change-to-concept`,
        ...opts,
      });
    },
    cancelOrder({
      orderId, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/orders/${orderId}`,
        ...opts,
      });
    },
    getOrderTags({
      orderId, ...opts
    }) {
      return this._makeRequest({
        path: `/orders/${orderId}/tags`,
        ...opts,
      });
    },
    addOrderTags({
      orderId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/orders/${orderId}/tags`,
        ...opts,
      });
    },
    addProductToOrder({
      orderId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/orders/${orderId}/products`,
        ...opts,
      });
    },
    getOrderComments({
      orderId, ...opts
    }) {
      return this._makeRequest({
        path: `/orders/${orderId}/comments`,
        ...opts,
      });
    },
    listTags(opts = {}) {
      return this._makeRequest({
        path: "/tags",
        ...opts,
      });
    },
    listProducts(opts = {}) {
      return this._makeRequest({
        path: "/products",
        ...opts,
      });
    },
  },
};
