import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "virtualsms",
  propDefinitions: {
    service: {
      type: "string",
      label: "Service",
      description: "The service to receive an SMS verification code for (e.g. `wa` for WhatsApp, `tg` for Telegram, `gm` for Google/Gmail). Use the **List Services** action to discover all 700+ supported services and their codes.",
      async options() {
        const { services = [] } = await this.listServices();
        return services
          .map((s) => ({
            label: `${s.service_name ?? s.name} (${s.service_id ?? s.code ?? s.id})`,
            value: String(s.service_id ?? s.code ?? s.id),
          }))
          .filter((opt) => opt.value);
      },
    },
    country: {
      type: "string",
      label: "Country",
      description: "The numeric country ID expected by the VirtualSMS API (e.g., `0` for Russia, `1` for Ukraine). Use the **List Countries** action to discover all available countries and their numeric IDs. Omit for the cheapest available country.",
      optional: true,
      async options() {
        const { countries = [] } = await this.listCountries();
        return countries
          .map((c) => ({
            label: `${c.country_name ?? c.name ?? c.id} (${c.country_id ?? c.id ?? c.iso})`,
            value: String(c.country_id ?? c.id ?? c.iso),
          }))
          .filter((opt) => opt.value);
      },
    },
    orderId: {
      type: "string",
      label: "Order ID",
      description: "The ID of an existing rental/activation order. Returned by the **Rent Number** action and surfaced by the **New SMS Received** trigger.",
      async options() {
        const orders = await this.listOrders();
        return orders
          .map((o) => ({
            label: `${o.phone_number ?? "no number"} — ${o.service ?? o.service_id ?? "?"}/${o.country ?? o.country_id ?? "?"} (${o.status})`,
            value: String(o.order_id ?? o.id),
          }))
          .filter((opt) => opt.value);
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://virtualsms.io/api/v1";
    },
    _headers() {
      return {
        "X-API-Key": `${this.$auth.api_key}`,
        "Accept": "application/json",
        "Content-Type": "application/json",
      };
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
        headers: {
          ...this._headers(),
          ...(otherOpts.headers ?? {}),
        },
      });
    },
    listServices(args = {}) {
      // GET /customer/services — returns { services: [...], success: true }
      return this._makeRequest({
        path: "/customer/services",
        ...args,
      });
    },
    listCountries(args = {}) {
      // GET /customer/countries — returns { countries: [...], success: true }
      return this._makeRequest({
        path: "/customer/countries",
        ...args,
      });
    },
    getBalance(args = {}) {
      // GET /customer/balance — returns { balance_usd, ... }
      return this._makeRequest({
        path: "/customer/balance",
        ...args,
      });
    },
    rentNumber({
      service, country, ...args
    } = {}) {
      // POST /customer/purchase — body { service, country }
      return this._makeRequest({
        method: "POST",
        path: "/customer/purchase",
        data: {
          service,
          ...(country
            ? {
              country,
            }
            : {}),
        },
        ...args,
      });
    },
    getOrder({
      orderId, ...args
    } = {}) {
      // GET /customer/order/{orderId}
      return this._makeRequest({
        path: `/customer/order/${encodeURIComponent(orderId)}`,
        ...args,
      });
    },
    cancelOrder({
      orderId, ...args
    } = {}) {
      // POST /customer/cancel/{orderId}
      return this._makeRequest({
        method: "POST",
        path: `/customer/cancel/${encodeURIComponent(orderId)}`,
        ...args,
      });
    },
    async listOrders(args = {}) {
      // GET /customer/orders — returns { orders: [...] } or [] on 404
      try {
        const res = await this._makeRequest({
          path: "/customer/orders",
          ...args,
        });
        if (Array.isArray(res)) {
          return res;
        }
        return res?.orders ?? [];
      } catch (err) {
        // Endpoint may be unavailable on some plans
        if (err?.response?.status === 404) {
          return [];
        }
        throw err;
      }
    },
  },
};
