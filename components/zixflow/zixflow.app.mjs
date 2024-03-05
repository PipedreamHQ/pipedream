import { axios } from "@pipedream/platform";
import constants from "./actions/common/constants.mjs";

export default {
  type: "app",
  app: "zixflow",
  propDefinitions: {
    activityId: {
      type: "string",
      label: "Activity ID",
      description: "The unique identifier for the activity or task",
    },
    iconType: {
      type: "string",
      label: "Icon Type",
      description: "Specifies the type of icon associated with the activity",
      options: constants.ICON_TYPES,
    },
    name: {
      type: "string",
      label: "Activity Name",
      description: "The name or title of the activity",
    },
    scheduleAt: {
      type: "string",
      label: "Schedule At",
      description: "Specifies the scheduled time for the activity in the format `YYYY-MM-DDTHH:mm:ss.SSSZ`",
    },
    description: {
      type: "string",
      label: "Description",
      description: "A description providing additional details about the activity",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.zixflow.com/api/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
      });
    },
    async createTask(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/collection-records/activity-list",
        ...args,
      });
    },
    async updateActivity({
      activityId, ...args
    }) {
      return this._makeRequest({
        method: "PATCH",
        path: `/collection-records/activity-list/${activityId}`,
        ...args,
      });
    },
    async deleteActivity({
      activityId, ...args
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/collection-records/activity-list/${activityId}`,
        ...args,
      });
    },
  },
};
