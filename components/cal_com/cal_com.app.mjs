import {
  axios, ConfigurationError,
} from "@pipedream/platform";
import retry from "async-retry";
import languages from "./common/languages.mjs";
import timeZones from "./common/time-zones.mjs";

export default {
  type: "app",
  app: "cal_com",
  propDefinitions: {
    bookingId: {
      type: "string",
      label: "Booking ID",
      description: "The identifier of the booking to retrieve",
      async options({ filterCancelled = false }) {
        const response = await this.listBookings();
        const bookings = response?.data ?? [];
        const filteredBookings = filterCancelled
          ? bookings.filter((booking) => booking.status !== "cancelled")
          : bookings;
        return filteredBookings.map((booking) => ({
          label: booking.title,
          value: booking.uid,
        }));
      },
    },
    eventTypeId: {
      type: "integer",
      label: "Event Type ID",
      description: "The identifier of the event type",
      async options() {
        const response = await this.listEventTypes();
        const eventTypes = response?.data ?? [];
        return eventTypes.map((type) => ({
          label: type.title,
          value: type.id,
        }));
      },
    },
    language: {
      type: "string",
      label: "Language",
      description: "The language for the booking",
      options: languages.LANGUAGE_OPTIONS,
    },
    timeZone: {
      type: "string",
      label: "Time Zone",
      description: "The time zone for the booking",
      options: timeZones.TIME_ZONES,
    },
  },
  methods: {
    _v2BaseUrl() {
      return "https://api.cal.com/v2/";
    },
    _apiKey() {
      return this.$auth.api_key;
    },
    _getHeaders() {
      return {
        "Content-Type": "application/json",
      };
    },
    async _makeV2Request(args = {}) {
      const {
        method = "GET",
        path,
        params = {},
        headers = {},
        $ = this,
        ...otherArgs
      } = args;
      const config = {
        method,
        url: `${this._v2BaseUrl()}${path}`,
        headers: {
          ...this._getHeaders(),
          "cal-api-version": "2024-06-14",
          "Authorization": `Bearer ${this._apiKey()}`,
          ...headers,
        },
        params: {
          ...params,
        },
        ...otherArgs,
      };
      try {
        return await this._withRetries(() => axios($, config));
      } catch (error) {
        const apiMessage =
          error?.response?.data?.error?.message ||
          error?.response?.data?.message ||
          error?.message ||
          "Unknown Cal.com API error";
        throw new ConfigurationError(apiMessage);
      }
    },
    _isRetriableStatusCode(statusCode) {
      return [
        408,
        429,
        500,
      ].includes(statusCode);
    },
    async _withRetries(apiCall) {
      const retryOpts = {
        retries: 3,
        factor: 2,
      };
      return retry(async (bail) => {
        try {
          const data = await apiCall();
          return data;
        } catch (err) {
          const status = err?.response?.status ?? 500;
          if (!this._isRetriableStatusCode(status)) {
            bail(err);
          }
          throw err;
        }
      }, retryOpts);
    },
    async createWebhook(data) {
      return this._makeV2Request({
        method: "POST",
        path: "webhooks",
        data,
      });
    },
    async deleteWebhook(hookId) {
      return this._makeV2Request({
        method: "DELETE",
        path: `webhooks/${hookId}`,
      });
    },
    async listBookings(args = {}) {
      return this._makeV2Request({
        path: "bookings",
        headers: {
          "cal-api-version": "2026-02-25",
        },
        ...args,
      });
    },
    async getBooking(bookingUid, $) {
      return this._makeV2Request({
        path: `bookings/${bookingUid}`,
        headers: {
          "cal-api-version": "2026-02-25",
        },
        $,
      });
    },
    async createBooking({
      data, $,
    }) {
      return this._makeV2Request({
        method: "POST",
        path: "bookings",
        headers: {
          "cal-api-version": "2026-02-25",
        },
        data,
        $,
      });
    },
    async deleteBooking(bookingUid, data = {}, $) {
      return this._makeV2Request({
        method: "POST",
        path: `bookings/${bookingUid}/cancel`,
        headers: {
          "cal-api-version": "2026-02-25",
        },
        data,
        $,
      });
    },
    async listEventTypes(args = {}) {
      return this._makeV2Request({
        path: "event-types",
        ...args,
      });
    },
    async getBookableSlots(args = {}) {
      return this._makeV2Request({
        path: "slots",
        headers: {
          "cal-api-version": "2024-09-04",
        },
        ...args,
      });
    },
  },
};
