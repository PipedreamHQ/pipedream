import metaobjects from "@pipedream/shopify/actions/common/metaobjects.mjs";
import { axios } from "@pipedream/platform";

export default {
  ...metaobjects,
  methods: {
    ...metaobjects.methods,
    async makeGraphQLRequest({
      $ = this, ...args
    }) {
      return axios($, {
        url: `https://${this.shopify.getShopId()}.myshopify.com/admin/api/2024-04/graphql.json`,
        method: "POST",
        headers: {
          "X-Shopify-Access-Token": `${this.shopify.$auth.access_token}`,
        },
        ...args,
      });
    },
  },
};
