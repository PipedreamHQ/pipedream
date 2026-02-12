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
        const { bookings = [] } = await this.listBookings();
        const filteredBookings = filterCancelled
          ? bookings.filter((booking) => booking.status !== "CANCELLED")
          : bookings;
        return filteredBookings.map((booking) => ({
          label: booking.title,
          value: booking.id,
        }));
      },
    },
    eventTypeId: {
      type: "integer",
      label: "Event Type ID",
      description: "The identifier of the event type of the new booking",
      async options() {
        const { event_types: eventTypes } = await this.listEventTypes();
        return eventTypes.map((type) => ({
          label: type.title,
          value: type.id,
        }));
      },
    },
    language: {
      type: "string",
      label: "Language",
      description: "The language for the new booking",
      options: languages.LANGUAGE_OPTIONS,
    },
    timeZone: {
      type: "string",
      label: "Time Zone",
      description: "The time-zone of the new booking",
      options: timeZones.TIME_ZONES,
    },
  },
  methods: {
    _baseUrl() {
      return `https://${this.$auth.domain}/v1/`;
    },
    _v2BaseUrl() {
      return `https://${this.$auth.domain}/v2/`;
    },
    _apiKey() {
      return this.$auth.api_key;
    },
    _getHeaders() {
      return {
        "Content-Type": "application/json",
      };
    },
    async _makeRequest(args = {}) {
      const {
        method = "GET",
        path,
        params = {},
        $ = this,
        ...otherArgs
      } = args;
      const config = {
        method,
        url: `${this._baseUrl()}${path}`,
        headers: this._getHeaders(),
        params: {
          ...params,
          apiKey: this._apiKey(),
        },
        ...otherArgs,
      };
      return this._withRetries(() => {
        return axios($, config);
      });
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
          "cal-api-version": "2024-08-13",
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
          const { status = 500 } = err;
          if (!this._isRetriableStatusCode(status)) {
            bail(`
              Unexpected error (status code: ${status}):
              ${JSON.stringify(err.response)}
            `);
          }
          throw err;
        }
      }, retryOpts);
    },
    async createWebhook(data) {
      return this._makeRequest({
        method: "POST",
        path: "hooks",
        data,
      });
    },
    async deleteWebhook(hookId) {
      return this._makeRequest({
        method: "DELETE",
        path: `hooks/${hookId}`,
      });
    },
    async getBooking(bookingId, $) {
      return this._makeRequest({
        path: `bookings/${bookingId}`,
        $,
      });
    },
    async listBookings(args = {}) {
      return this._makeRequest({
        path: "bookings",
        ...args,
      });
    },
    async createBooking(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "bookings",
        ...args,
      });
    },
    async createBookingV2({
      data, $,
    }) {
      return this._makeV2Request({
        method: "POST",
        path: "bookings",
        data,
        $,
      });
    },
    async deleteBooking(bookingId, $) {
      return this._makeRequest({
        method: "DELETE",
        path: `bookings/${bookingId}`,
        $,
      });
    },
    async listEventTypes(args = {}) {
      return this._makeRequest({
        path: "event-types",
        ...args,
      });
    },
    async getBookableSlots(args = {}) {
      return this._makeRequest({
        path: "slots",
        ...args,
      });
    },
  },
};
