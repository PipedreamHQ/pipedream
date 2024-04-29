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
      async options({ page }) {
        const { data: resources } = await this.getActivities({
          data: {
            offset: page * 100,
            limit: 100,
          },
        });

        return resources.map(({
          _id, name,
        }) => ({
          value: _id,
          label: name,
        }));
      },
    },
    associatedId: {
      type: "string",
      label: "Associated ID",
      description: "The ID of the collection record associated with the activity.",
      async options({ page }) {
        const { data: resources } = await this.getCollections({
          data: {
            offset: page * 100,
            limit: 100,
          },
        });

        return resources.map(({
          _id, name,
        }) => ({
          value: _id,
          label: name,
        }));
      },
    },
    statusId: {
      type: "string",
      label: "Status ID",
      description: "The ID of the status attribute indicating the current status of the activity",
    },
    iconType: {
      type: "string",
      label: "Icon Type",
      description: "Specifies the type of icon associated with the activity",
      options: constants.ICON_TYPES,
    },
    iconValue: {
      type: "string",
      label: "Icon Value",
      description: "Defines the specific value of the icon based on the iconType",
      async options({ iconType }) {
        if (iconType === "interaction") return constants.INTERACTION_TYPES;
        if (iconType === "messaging_app") return constants.INTERACTION_TYPES;

        return [];
      },
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
    status: {
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
    async createActivity(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/collection-records/activity-list",
        ...args,
      });
    },
    async getCollections(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/collections",
        ...args,
      });
    },
    async getActivities(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/collection-records/activity-list/query",
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
