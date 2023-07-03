import shopify from "../../shopify_developer_app.app.mjs";
import common from "../../../shopify/sources/customer-data-request/common.mjs";

export default {
  ...common,
  name: "New Customer Data Request (Instant)",
  version: "0.0.1",
  key: "shopify_developer_app-customer-data-request",
  description: "Emit new customer data requests for data via a GDPR request.",
  type: "source",
  props: {
    shopify,
    // eslint-disable-next-line pipedream/props-label, pipedream/props-description
    shopifyApphook: {
      type: "$.interface.apphook",
      appProp: "shopify",
      eventNames: [
        "customers/data_request",
      ],
    },
  },
};
