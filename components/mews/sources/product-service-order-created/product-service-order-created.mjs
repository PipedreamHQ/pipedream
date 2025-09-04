import base from "../common/polling.mjs";

export default {
  ...base,
  name: "New Product Service Order Created",
  description: "Emit new product service orders as they are created (polling). [See the documentation](https://mews-systems.gitbook.io/connector-api/operations/productserviceorders#get-all-product-service-orders)",
  key: "mews-product-service-order-created",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    ...base.props,
    serviceIds: {
      type: "string[]",
      label: "Service IDs",
      description: "Identifiers of the services for which the product is available.",
      propDefinition: [
        base.props.app,
        "serviceId",
      ],
    },
  },
  methods: {
    ...base.methods,
    getRequester() {
      return this.app.productServiceOrdersGetAll;
    },
    getResultKey() {
      return "ProductServiceOrders";
    },
    getResourceName() {
      return "Product Service Order";
    },
    getId(resource) {
      return resource?.Id || resource?.id;
    },
    getDateField() {
      return "CreatedUtc";
    },
    getDateFilterField() {
      return "CreatedUtc";
    },
    getStaticFilters() {
      return {
        ServiceIds: this.serviceIds,
      };
    },
  },
};

