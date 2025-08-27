import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";
const DEFAULT_LIMIT = 100;

export default {
  type: "app",
  app: "trunkrs",
  propDefinitions: {
    trunkrsNr: {
      type: "string",
      label: "Trunkrs Number",
      description: "The Trunkrs number of the shipment",
      async options({ page }) {
        const { data } = await this.listShipments({
          params: {
            limit: DEFAULT_LIMIT,
            offset: page * DEFAULT_LIMIT,
          },
        });
        return data?.map((shipment) => ({
          label: shipment.orderReference,
          value: shipment.trunkrsNr,
        })) || [];
      },
    },
    timeSlotId: {
      type: "string",
      label: "Time Slot ID",
      description: "The ID of the time slot to use for the shipment",
      optional: true,
      async options({
        country, postalCode,
      }) {
        const { data } = await this.listTimeSlots({
          params: {
            country,
            postalCode,
          },
        });
        return data.map(({
          id, merchant, deliveryWindow,
        }) => ({
          label: `${merchant.name} - ${deliveryWindow.start} - ${deliveryWindow.end}`,
          value: id,
        }) );
      },
    },
    country: {
      type: "string",
      label: "Country",
      description: "The country of the sender",
      options: constants.COUNTRIES,
    },
  },
  methods: {
    _baseUrl() {
      return `${this.$auth.environment}/api/v2`;
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          "x-api-key": `${this.$auth.api_key}`,
        },
        ...opts,
      });
    },
    createWebhook(opts = {}) {
      return this._makeRequest({
        path: "/webhooks",
        method: "POST",
        ...opts,
      });
    },
    deleteWebhook({
      webhookId, ...opts
    }) {
      return this._makeRequest({
        path: `/webhooks/${webhookId}`,
        method: "DELETE",
        ...opts,
      });
    },
    getShipment({
      trunkrsNr, ...opts
    }) {
      return this._makeRequest({
        path: `/shipments/${trunkrsNr}`,
        ...opts,
      });
    },
    getShipmentState({
      trunkrsNr, ...opts
    }) {
      return this._makeRequest({
        path: `/shipments/${trunkrsNr}/status`,
        ...opts,
      });
    },
    listShipments(opts = {}) {
      return this._makeRequest({
        path: "/shipments",
        ...opts,
      });
    },
    listTimeSlots(opts = {}) {
      return this._makeRequest({
        path: "/timeslots",
        ...opts,
      });
    },
    createShipment(opts = {}) {
      return this._makeRequest({
        path: "/shipments",
        method: "POST",
        ...opts,
      });
    },
    cancelShipment({
      trunkrsNr, ...opts
    }) {
      return this._makeRequest({
        path: `/shipments/${trunkrsNr}`,
        method: "DELETE",
        ...opts,
      });
    },
    async *paginate({
      fn, args, max,
    }) {
      args = {
        ...args,
        params: {
          ...args?.params,
          limit: DEFAULT_LIMIT,
        },
      };
      let total, count = 0;
      do {
        const { data } = await fn(args);
        total = data?.length;
        if (!data?.length) {
          return;
        }
        for (const item of data) {
          yield item;
          if (max && ++count >= max) {
            return;
          }
        }
        args.params.offset += args.params.limit;
      } while (total === args.params.limit);
    },
  },
};
