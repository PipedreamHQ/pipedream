import { axios } from "@pipedream/platform";
import {
  CLASH_RESOLUTION_OPTIONS, LIMIT, TIMEZONE_OPTIONS,
} from "./common/constants.mjs";

export default {
  type: "app",
  app: "resource_guru",
  propDefinitions: {
    billable: {
      type: "boolean",
      label: "Billable",
      description: "Indicates whether this booking is billable or non-billable. If null, it defaults to the assigned project's billable setting, or false if no project is assigned.",
    },
    bookerId: {
      type: "integer",
      label: "Booker Id",
      description: "The unique identifier of the user that this event is booked by, defaults to the authenticated User.",
      async options({ page }) {
        const data = await this.listUsers({
          params: {
            limit: LIMIT,
            offset: LIMIT * page,
          },
        });

        return data.map(({
          id: value, first_name: fName, last_name: lName, email,
        }) => ({
          label: `${fName} ${lName} - ${email}`,
          value,
        }));
      },
    },
    bookingId: {
      type: "integer",
      label: "Booking Id",
      description: "The unique identifier of the booking.",
      async options({ page }) {
        const data = await this.listBookings({
          params: {
            limit: LIMIT,
            offset: LIMIT * page,
          },
        });

        return data.map(({
          id: value, start_date: sDate, end_date: eDate,
        }) => ({
          label: `${value} (${sDate} - ${eDate})`,
          value,
        }));
      },
    },
    clashResolution: {
      type: "string",
      label: "Clash Resolution",
      description: "How to resolve the booking clash if present. The option `add_to_waiting_list` moves the clashing booking to the waiting list. The option `book_with_overtime` adds additional overtime to the resource and increases availability to accommodate the booking. The option `increase_availability` only increases availability and does not add overtime to the resource.",
      options: CLASH_RESOLUTION_OPTIONS,
    },
    clientId: {
      type: "integer",
      label: "Client Id",
      description: "Unique identifier of the Client this Booking is for.",
      async options({ page }) {
        const data = await this.listClients({
          params: {
            limit: LIMIT,
            offset: LIMIT * page,
          },
        });

        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    details: {
      type: "string",
      label: "Details",
      description: "Extra details for the booking.",
    },
    duration: {
      type: "integer",
      label: "Duration",
      description: "The length of each booking in minutes.",
      min: 1,
      max: 1440,
    },
    endDate: {
      type: "string",
      label: "End Date",
      description: "Last date of the booking in `YYYY-MM-DD` format, for example `2023-12-20`",
    },
    projectId: {
      type: "integer",
      label: "Project Id",
      description: "Unique identifier of the Project this Booking is for.",
      async options({ page }) {
        const data = await this.listProjects({
          params: {
            limit: LIMIT,
            offset: LIMIT * page,
          },
        });

        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    resourceIds: {
      type: "string[]",
      label: "Resource Ids",
      description: "The unique identifier of all booked resources.",
      async options({ page }) {
        const data = await this.listResources({
          params: {
            limit: LIMIT,
            offset: LIMIT * page,
          },
        });

        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    rrule: {
      type: "string",
      label: "Recurrence Rule",
      description: "A recurrence rule defines a rule or repeating pattern for recurring events in JSON string. For example, `{\"weekly\": {\"interval\": 1, \"weekday\": 6, \"ends\": {\"type\": \"count\", \"count\": 1}}}`. See [API documentation](https://resourceguruapp.com/docs/api#tag/booking/paths/~1v1~1%7Baccount%7D~1bookings/post) for more information.",
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "First date of the booking in `YYYY-MM-DD` format, for example `2023-12-20`",
    },
    startTime: {
      type: "string",
      label: "Start Time",
      description: "The time the booking starts. `Format HH:MM`",
    },
    tentative: {
      type: "boolean",
      label: "Tentative",
      description: "When `true` this is a tentative booking. Tentative bookings do not take up availability.",
    },
    timezone: {
      type: "string",
      label: "Timezone",
      description: "Specified timezone for the booking, or null/empty string for the local resource's timezones.",
      options: TIMEZONE_OPTIONS,
    },
  },
  methods: {
    _apiUrl() {
      return `https://api.resourceguruapp.com/v1/${this.$auth.account_url_id}`;
    },
    _getHeaders() {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._apiUrl()}/${path}`,
        headers: this._getHeaders(),
        ...opts,
      });
    },
    createBooking(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "bookings",
        ...opts,
      });
    },
    createHook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "webhooks",
        ...opts,
      });
    },
    deleteHook(hookId) {
      return this._makeRequest({
        method: "DELETE",
        path: `webhooks/${hookId}`,
      });
    },
    listBookings(opts = {}) {
      return this._makeRequest({
        path: "bookings",
        ...opts,
      });
    },
    listClients(opts = {}) {
      return this._makeRequest({
        path: "clients",
        ...opts,
      });
    },
    listUsers(opts = {}) {
      return this._makeRequest({
        path: "users",
        ...opts,
      });
    },
    listProjects(opts = {}) {
      return this._makeRequest({
        path: "projects",
        ...opts,
      });
    },
    listResources(opts = {}) {
      return this._makeRequest({
        path: "resources",
        ...opts,
      });
    },
    updateBooking({
      bookingId, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `bookings/${bookingId}`,
        ...opts,
      });
    },
    deleteBooking({
      bookingId, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `bookings/${bookingId}`,
        ...opts,
      });
    },
  },
};
