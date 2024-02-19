import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "rkvst",
  propDefinitions: {
    assetId: {
      type: "string",
      label: "Asset ID",
      description: "The unique identifier of the asset",
    },
    newAssetData: {
      type: "object",
      label: "New Asset Data",
      description: "The data for the new asset to be created",
    },
    activityType: {
      type: "string",
      label: "Activity Type",
      description: "Type of activity to monitor on an asset",
      options: [
        {
          label: "Modified",
          value: "modified",
        },
        {
          label: "New Activity",
          value: "new_activity",
        },
      ],
    },
    trackingOperation: {
      type: "string",
      label: "Tracking Operation",
      description: "Choose to Start or Stop tracking an asset",
      options: [
        {
          label: "Start Tracking",
          value: "StartTracking",
        },
        {
          label: "Stop Tracking",
          value: "StopTracking",
        },
      ],
    },
    trackingData: {
      type: "object",
      label: "Tracking Data",
      description: "Data required for tracking or untracking an asset",
    },
    eventType: {
      type: "string",
      label: "Event Type",
      description: "The type of event to track or untrack an asset",
      options: [
        {
          label: "Start Tracking",
          value: "StartTracking",
        },
        {
          label: "Stop Tracking",
          value: "StopTracking",
        },
      ],
    },
    eventAttributes: {
      type: "object",
      label: "Event Attributes",
      description: "The attributes for the event",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.datatrails.ai/archivist/v2";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        data,
        params,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Content-type": "application/json",
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
        data,
        params,
      });
    },
    async createAsset({ newAssetData }) {
      return this._makeRequest({
        method: "POST",
        path: "/assets",
        data: newAssetData,
      });
    },
    async trackOrUntrackAsset({
      assetId, eventType, eventAttributes = {},
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/assets/${assetId}/events`,
        data: {
          operation: eventType,
          behaviour: "Builtin",
          ...eventAttributes,
        },
      });
    },
  },
  version: "0.0.1",
};
