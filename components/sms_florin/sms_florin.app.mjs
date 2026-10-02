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
    /**
     * List the services a number can be rented for, with their prices.
     * @returns {Promise<{ services: object[] }>} Each service has `slug`, `name`, `basePriceCents` and `monthlyPriceCents`.
     */
    async listServices(opts = {}) {
      return this._makeRequest({
        path: "/services",
        ...opts,
      });
    },
    /**
     * Rent a number for a service, debiting the account balance.
     * @param {object} args
     * @param {{ serviceSlug: string, period: "instant"|"monthly" }} args.data - The rental request.
     * @returns {Promise<{ rentalId: number }>}
     */
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
    /**
     * List the account's rentals, newest first, each with its received messages.
     * @param {object} [args]
     * @param {{ limit?: number }} [args.params] - `limit` caps how many rentals are returned.
     * @returns {Promise<{ rentals: object[] }>}
     */
    async listRentals({
      params, ...opts
    } = {}) {
      return this._makeRequest({
        path: "/rentals",
        params,
        ...opts,
      });
    },
    /**
     * Get a single rental's current status, phone number and messages.
     * @param {object} args
     * @param {number} args.rentalId - The rental to fetch.
     * @returns {Promise<object>}
     */
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
