import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";
import utils from "./common/utils.mjs";

export default {
  type: "app",
  app: "billbee",
  propDefinitions: {
    orderId: {
      type: "string",
      label: "Order ID",
      description: "The ID of the order",
      async options({ page }) {
        const { Data: orders } = await this.listOrders({
          params: {
            page: page + 1,
            pageSize: constants.DEFAULT_LIMIT,
          },
        });
        return orders?.map(({ BillBeeOrderId: value }) => String(value)) || [];
      },
    },
    customerId: {
      type: "string",
      label: "Customer ID",
      description: "The ID of the customer",
      async options({ page }) {
        const { Data: customers } = await this.listCustomers({
          params: {
            page: page + 1,
            pageSize: constants.DEFAULT_LIMIT,
          },
        });
        return customers?.map(({
          Id: value, Name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    product: {
      type: "string",
      label: "Product ID",
      description: "The ID of the product",
      async options({
        page,
        filter = () => true,
        mapper = ({
          Id: value, Title: title,
        }) => ({
          value,
          label: title?.[0]?.Text || "Untitled",
        }),
      }) {
        const { Data: products } = await this.listProducts({
          params: {
            page: page + 1,
            pageSize: constants.DEFAULT_LIMIT,
          },
        });
        return products?.filter(filter).map(mapper) || [];
      },
    },
    shopId: {
      type: "string",
      label: "Shop ID",
      description: "Specifies a shop ID for which orders should be included",
      optional: true,
      async options({ page }) {
        const { Data: shopAccounts } = await this.listShopAccounts({
          params: {
            page: page + 1,
            pageSize: constants.DEFAULT_LIMIT,
          },
        });
        return shopAccounts?.map(({
          Id: value, Name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    orderStateId: {
      type: "string",
      label: "Order State ID",
      description: "Specifies a state ID to include in the response",
      optional: true,
      async options({ page }) {
        const orderStates = await this.listOrderStates({
          params: {
            page: page + 1,
            pageSize: constants.DEFAULT_LIMIT,
          },
        });
        return orderStates?.map(({
          Id: value, Name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    tag: {
      type: "string",
      label: "Tag",
      description: "Specifies a tag the order must have attached to be included in the response",
      optional: true,
    },
    stockId: {
      type: "string",
      label: "Stock ID",
      description: "The ID of the stock.",
      optional: true,
      async options({ page }) {
        const { Data: stocks } = await this.listStocks({
          params: {
            page: page + 1,
            pageSize: constants.DEFAULT_LIMIT,
          },
        });
        return stocks?.map(({
          Id: value, Name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    cloudStorageId: {
      type: "string",
      label: "Cloud Storage ID",
      description: "The ID of the connected cloud printer/storage to send the invoice to",
      optional: true,
      async options() {
        const { Data: sendToClouds } = await this.listCloudStorages();
        return sendToClouds?.map(({
          Id: value, Name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    shippingProviderId: {
      type: "string",
      label: "Shipping Provider ID",
      description: "The ID of the shipping provider",
      optional: true,
      async options() {
        const { Data: shippingProviders } = await this.listShippingProviders();
        return shippingProviders?.map(({
          Id: value, Name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    shipment: {
      type: "string",
      label: "Shipment ID",
      description: "The ID of the shipment",
      optional: true,
      async options({
        page,
        orderId,
        shippingProviderId,
        mapper = ({ BillbeeId: value }) => value,
      }) {
        const { Data: shippingProviderProducts } = await this.listShipments({
          params: {
            page: page + 1,
            pageSize: constants.DEFAULT_LIMIT,
            orderId,
            shippingProviderId,
          },
        });
        return shippingProviderProducts?.map(mapper) || [];
      },
    },
    carrierId: {
      type: "string",
      label: "Carrier ID",
      description: "The ID of the carrier",
      optional: true,
      async options() {
        const carriers = await this.listShippingCarriers();
        return carriers?.map(({
          Id: value, Name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    shipmentType: {
      type: "string",
      label: "Shipment Type",
      description: "The type of the shipment",
      optional: true,
      async options() {
        const shipmentTypes = await this.listShipmentTypes();
        return shipmentTypes?.map(({
          Id: value, Name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
  },
  methods: {
    getBaseUrl() {
      return `${constants.BASE_URL}${constants.VERSION_PATH}`;
    },
    getUrl(path, url) {
      return url || `${this.getBaseUrl()}${path}`;
    },
    getHeaders(headers) {
      return {
        ...headers,
        "x-billbee-api-key": this.$auth.api_key,
      };
    },
    getAuth() {
      const {
        username,
        api_password: password,
      } = this.$auth;

      return {
        username,
        password,
      };
    },
    makeRequest({
      $ = this, path, headers, url, ...args
    } = {}) {
      const {
        getUrl,
        getHeaders,
        getAuth,
      } = this;

      return axios($, {
        headers: getHeaders(headers),
        url: getUrl(path, url),
        auth: getAuth(),
        ...args,
      });
    },
    post(args = {}) {
      return this.makeRequest({
        method: "post",
        ...args,
      });
    },
    put(args = {}) {
      return this.makeRequest({
        method: "put",
        ...args,
      });
    },
    delete(args = {}) {
      return this.makeRequest({
        method: "delete",
        ...args,
      });
    },
    patch(args = {}) {
      return this.makeRequest({
        method: "patch",
        ...args,
      });
    },
    // Orders
    listOrders(args = {}) {
      return this.makeRequest({
        path: "/orders",
        ...args,
      });
    },
    getOrder({
      orderId, ...args
    } = {}) {
      return this.makeRequest({
        path: `/orders/${orderId}`,
        ...args,
      });
    },
    createOrder(args = {}) {
      return this.post({
        path: "/orders",
        ...args,
      });
    },
    updateOrder({
      orderId, ...args
    } = {}) {
      return this.patch({
        path: `/orders/${orderId}`,
        ...args,
      });
    },
    changeOrderState({
      orderId, ...args
    } = {}) {
      return this.put({
        path: `/orders/${orderId}/orderstate`,
        ...args,
      });
    },
    addShipmentToOrder({
      orderId, ...args
    } = {}) {
      return this.post({
        path: `/orders/${orderId}/shipment`,
        ...args,
      });
    },
    createInvoiceForOrder({
      orderId, ...args
    } = {}) {
      return this.post({
        path: `/orders/CreateInvoice/${orderId}`,
        ...args,
      });
    },
    // Products
    listProducts(args = {}) {
      return this.makeRequest({
        path: "/products",
        ...args,
      });
    },
    updateStock(args = {}) {
      return this.post({
        path: "/products/updatestock",
        ...args,
      });
    },
    listStocks(args = {}) {
      return this.makeRequest({
        path: "/products/stocks",
        ...args,
      });
    },
    // Customers
    listCustomers(args = {}) {
      return this.makeRequest({
        path: "/customers",
        ...args,
      });
    },
    listShopAccounts(args = {}) {
      return this.makeRequest({
        path: "/shopaccounts",
        ...args,
      });
    },
    listOrderStates(args = {}) {
      return this.makeRequest({
        path: "/enums/orderstates",
        ...args,
      });
    },
    listCloudStorages(args = {}) {
      return this.makeRequest({
        path: "/cloudstorages",
        ...args,
      });
    },
    listShippingProviders(args = {}) {
      return this.makeRequest({
        path: "/shipment/shippingproviders",
        ...args,
      });
    },
    listShipments(args = {}) {
      return this.makeRequest({
        path: "/shipment/shipments",
        ...args,
      });
    },
    listShippingCarriers(args = {}) {
      return this.makeRequest({
        path: "/shipment/shippingcarriers",
        ...args,
      });
    },
    listShipmentTypes(args = {}) {
      return this.makeRequest({
        path: "/enums/shipmenttypes",
        ...args,
      });
    },
    async *getIterations({
      resourcesFn, resourcesFnArgs, resourceName,
      lastDateAt, dateField,
      max = constants.DEFAULT_MAX,
    }) {
      let page = 1;
      let resourcesCount = 0;

      while (true) {
        const response =
          await resourcesFn({
            ...resourcesFnArgs,
            params: {
              ...resourcesFnArgs?.params,
              page,
              pageSize: constants.DEFAULT_LIMIT,
            },
          });

        const nextResources = utils.getNestedProperty(response, resourceName);

        if (!nextResources?.length) {
          console.log("No more resources found");
          return;
        }

        for (const resource of nextResources) {
          const isDateGreater =
            lastDateAt
              && Date.parse(resource[dateField]) >= Date.parse(lastDateAt);

          if (!lastDateAt || isDateGreater) {
            yield resource;
            resourcesCount += 1;
          }

          if (resourcesCount >= max) {
            console.log("Reached max resources");
            return;
          }
        }

        if (nextResources.length < constants.DEFAULT_LIMIT) {
          console.log("No next page found");
          return;
        }

        page += 1;
      }
    },
    paginate(args = {}) {
      return utils.iterate(this.getIterations(args));
    },
  },
};
