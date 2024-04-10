import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "sendy",
  propDefinitions: {
    brandId: {
      type: "string",
      label: "Brand ID",
      description: "The ID of the brand.",
      async options() {
        const data = await this.listBrands();

        return Object.keys(data).map(((key) => ({
          label: data[key].name,
          value: data[key].id,
        })));
      },
    },
    listId: {
      type: "string",
      label: "List ID",
      description: "The ID of the list you want to subscribe a user.",
      async options({ brandId }) {
        const data = await this.listLists({
          data: {
            brand_id: brandId,
          },
        });

        return Object.keys(data).map((key) => ({
          label: data[key].name,
          value: data[key].id,
        }));
      },
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the subscriber.",
    },
    name: {
      type: "string",
      label: "Name",
      description: "The subscriber's name.",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "The subscriber's country (2-letter code).",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return `https://${this.$auth.domain}`;
    },
    _data(data = {}) {
      return {
        ...data,
        api_key: `${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this, path, data, ...otherOpts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        data: this._data(data),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        ...otherOpts,
      });
    },
    addOrUpdateSubscriber(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/subscribe",
        ...opts,
      });
    },
    listBrands(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/api/brands/get-brands.php",
        ...opts,
      });
    },
    listLists(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/api/lists/get-lists.php",
        ...opts,
      });
    },
    createDraftCampaign(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/api/campaigns/create.php",
        ...opts,
      });
    },
    removeSubscriber(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/unsubscribe",
        ...opts,
      });
    },
  },
};
