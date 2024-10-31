import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "tremendous",
  propDefinitions: {
    campaignId: {
      type: "string",
      label: "Campaign ID",
      description: "ID of the campaign in your account, that defines the available products (different gift cards, charity, etc.) that the recipient can choose from.",
      async options() {
        const { campaigns } = await this.listCampaigns();
        return campaigns?.map(({
          id, name,
        }) => ({
          label: name,
          value: id,
        }));
      },
    },
    products: {
      type: "string[]",
      label: "Products",
      description: "IDs of products (different gift cards, charity, etc.) that will be available to the recipient to choose from. If this and `Campaign ID` are specified, this will override the products made available by the campaign. It will not override other campaign attributes, like the message and customization of the look and feel.",
      async options() {
        const { products } = await this.listProducts();
        return products?.map(({
          id, name,
        }) => ({
          label: name,
          value: id,
        }));
      },
    },
    fundingSourceId: {
      type: "string",
      label: "Funding Source ID",
      description: "Tremendous ID of the funding source that will be used to pay for the order. Use `balance` to use your Tremendous's balance.",
      async options() {
        const response = await this.listFundingSources();
        return response.funding_sources?.map(({
          id, method,
        }) => ({
          label: `${id} - ${method}`,
          value: id,
        }));
      },
    },
  },
  methods: {
    _baseRequest({
      $, headers, ...args
    }) {
      return axios($, {
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
        baseURL: "https://testflight.tremendous.com/api/v2",
        ...args,
      });
    },
    createOrder(args) {
      return this._baseRequest({
        method: "POST",
        url: "/orders",
        ...args,
      });
    },
    listCampaigns() {
      return this._baseRequest({
        method: "GET",
        url: "/campaigns",
      });
    },
    listProducts() {
      return this._baseRequest({
        method: "GET",
        url: "/products",
      });
    },
    listFundingSources() {
      return this._baseRequest({
        method: "GET",
        url: "/funding_sources",
      });
    },
  },
};
