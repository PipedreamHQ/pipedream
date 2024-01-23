import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "timebuzzer",
  propDefinitions: {
    activityId: {
      type: "string",
      label: "Activity ID",
      description: "The activity to be updated in timebuzzer",
      async options({ page }) {
        const count = constants.DEFAULT_LIMIT;
        const params = {
          count,
          offset: page * count,
        };
        const { activities } = await this.listActivities({
          params,
        });
        return activities?.map(({
          id: value, note: label,
        }) => ({
          value,
          label,
        }));
      },
    },
    tileIds: {
      type: "integer[]",
      label: "Tile IDs",
      description: "Array of Tile Ids",
      async options() {
        const tiles = await this.listTiles();
        return tiles?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    userId: {
      type: "integer",
      label: "User ID",
      description: "User-ID of the owning user",
      async options() {
        const { users } = await this.getAccount();
        return users?.map(({
          id: value, firstName, lastName,
        }) => ({
          value,
          label: `${firstName} ${lastName}`,
        })) || [];
      },
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "Start Date of this Activity in UTC. e.g. `2016-12-10T09:00:00.000Z`",
    },
    endDate: {
      type: "string",
      label: "End Date",
      description: "End Date of this Activity in UTC. e.g. `2016-12-10T09:00:00.000Z`",
    },
    startUtcOffset: {
      type: "string",
      label: "Start UTC Offset",
      description: "Offset to UTC for the start date. e.g. \"+02:00\"",
      optional: true,
    },
    endUtcOffset: {
      type: "string",
      label: "End UTC Offset",
      description: "Offset to UTC for the end date. e.g. \"+02:00\"",
      optional: true,
    },
    note: {
      type: "string",
      label: "Note",
      description: "A note about the activity",
    },
  },
  methods: {
    _baseUrl() {
      return "https://my.timebuzzer.com/open-api";
    },
    _headers() {
      return {
        Authorization: `APIKey ${this.$auth.api_key}`,
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
        headers: this._headers(),
      });
    },
    createWebhook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/webhooks",
        ...opts,
      });
    },
    deleteWebhook(opts = {}) {
      return this._makeRequest({
        method: "DELETE",
        path: "/webhooks",
        ...opts,
      });
    },
    getAccount(opts = {}) {
      return this._makeRequest({
        path: "/account",
        ...opts,
      });
    },
    getActivity({
      activityId, ...opts
    }) {
      return this._makeRequest({
        path: `/activities/${activityId}`,
        ...opts,
      });
    },
    listActivities(opts = {}) {
      return this._makeRequest({
        path: "/activities",
        ...opts,
      });
    },
    listFilteredActivities(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/activities/filters",
        ...opts,
      });
    },
    listTiles(opts = {}) {
      return this._makeRequest({
        path: "/tiles",
        ...opts,
      });
    },
    createActivity(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/activities",
        ...opts,
      });
    },
    updateActivity({
      activityId, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/activities/${activityId}`,
        ...opts,
      });
    },
  },
};
