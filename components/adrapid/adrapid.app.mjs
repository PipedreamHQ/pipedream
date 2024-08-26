import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "adrapid",
  propDefinitions: {
    bannerId: {
      type: "string",
      label: "Banner ID",
      description: "The ID of the banner to retrieve",
    },
    bannerData: {
      type: "object",
      label: "Banner Data",
      description: "The data necessary for creating the banner",
    },
    bannerSettings: {
      type: "object",
      label: "Banner Settings",
      description: "Optional settings or attributes for the banner",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.adrapid.com/v1/api";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path = "/",
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.jwt}`,
        },
      });
    },
    async emitNewBannerEvent() {
      const banners = await this._makeRequest({
        path: "/banners",
      });
      for (const banner of banners) {
        if (banner.status === "ready") {
          this.$emit(banner, {
            summary: `New banner ready: ${banner.id}`,
            id: banner.id,
          });
        }
      }
    },
    async retrieveBanner({ bannerId }) {
      return this._makeRequest({
        path: `/banners/${bannerId}`,
      });
    },
    async createBanner({
      bannerData, bannerSettings,
    }) {
      const data = {
        ...bannerData,
        ...bannerSettings,
      };
      return this._makeRequest({
        method: "POST",
        path: "/banners",
        data,
      });
    },
    async pollForBannerReady({ bannerId }) {
      while (true) {
        const banner = await this.retrieveBanner({
          bannerId,
        });
        if (banner.status === "ready") {
          return banner;
        }
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
