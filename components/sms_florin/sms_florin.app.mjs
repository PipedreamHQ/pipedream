import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "sms_florin",
  propDefinitions: {
    serviceSlug: {
      type: "string",
      label: "Service",
      description: "The service to rent a number for (e.g. `whatsapp`, `telegram`, `google`).",
      async options() {
        const { services } = await this.listServices();
        return services?.map(({
          slug, name,
        }) => ({
          label: name,
          value: slug,
        })) || [];
      },
    },
    period: {
      type: "string",
      label: "Period",
      description: "How long to hold the number. `instant` is a short rental for a single code; `monthly` keeps the number for 30 days.",
      options: [
        "instant",
        "monthly",
      ],
      default: "instant",
    },
    rentalId: {
      type: "integer",
      label: "Rental ID",
      description: "The ID of a rental, as returned by **Rent a Number**.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://flo-voice1.com/api/v1";
    },
    async _makeRequest({
      $, path, ...opts
    }) {
      return axios($ || this, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
        ...opts,
      });
    },
    async listServices(opts = {}) {
      return this._makeRequest({
        path: "/services",
        ...opts,
      });
    },
    async rentNumber({
      data, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/rentals",
        data,
        ...opts,
      });
    },
    async listRentals({
      params, ...opts
    } = {}) {
      return this._makeRequest({
        path: "/rentals",
        params,
        ...opts,
      });
    },
    async getRental({
      rentalId, ...opts
    }) {
      return this._makeRequest({
        path: `/rentals/${rentalId}`,
        ...opts,
      });
    },
  },
};
