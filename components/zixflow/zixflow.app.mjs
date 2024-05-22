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
    associationType: {
      type: "string",
      label: "Association Type",
      description: "The association type.",
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
    associatedId: {
      type: "string",
      label: "Associated ID",
      description: "The ID of the collection record associated with the activity.",
      async options({
        page, associationType,
      }) {
        const { data: resources } = await this.getCollectionsRecords({
          associationType,
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
      description: "The unique identifier for the status attribute. To get the Status ID, please use Get Activities action to get all activities, then investigate the `status` field in each record",
      async options({ page }) {
        const { data: resources } = await this.getActivities({
          data: {
            offset: page * 100,
            limit: 100,
          },
        });

        return resources.filter((r) => !!r.status).map(({
          status: {
            _id, name,
          },
        }) => ({
          value: _id,
          label: name,
        }));
      },
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
    filter: {
      type: "string",
      label: "Filter",
      description: "An array that will eventually allow users to define specific criteria for filtering data. Currently, it is an empty array, indicating that no filtering is applied at this time.",
      optional: true,
    },
    sort: {
      type: "string",
      label: "Sort",
      description: "An array that will eventually enable users to specify sorting criteria for the data. Like the filter array, it is currently empty, implying that no sorting is applied in the current context.",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "The number of records to be returned, set to 10 in this instance. This parameter restricts the response to a specific quantity of records.",
      optional: true,
    },
    offset: {
      type: "integer",
      label: "Offset",
      description: "The starting point from which the records are to be fetched within the entire dataset. In this case, it is set to 0, indicating that retrieval should commence from the beginning of the dataset.",
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
        path: "/collections",
        ...args,
      });
    },
    async getCollectionsRecords({
      associationType, ...args
    }) {
      return this._makeRequest({
        path: `/collection-records/${associationType}/query`,
        method: "post",
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
