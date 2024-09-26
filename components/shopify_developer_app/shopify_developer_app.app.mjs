import commonApp from "../shopify/common-app.mjs";
import Shopify from "shopify-api-node";

export default {
  ...commonApp,
  type: "app",
  app: "shopify_developer_app",
  methods: {
    ...commonApp.methods,
    getShopifyInstance() {
      return new Shopify({
        shopName: this.getShopId(),
        accessToken: this.$auth.access_token,
        autoLimit: true,
      });
    },
  },
};
