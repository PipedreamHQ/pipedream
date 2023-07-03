import shopify from "../../shopify.app.mjs";
import common from "./common.mjs";

export default {
  ...common,
  name: "New Customer Data Request (Instant)",
  version: "0.0.11",
  key: "shopify-customer-data-request",
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
