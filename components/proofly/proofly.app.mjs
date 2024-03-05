import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "proofly",
  propDefinitions: {
    dataId: {
      type: "string",
      label: "Data ID",
      description: "The unique identifier for the notification data",
    },
    dataContent: {
      type: "string",
      label: "Data Content",
      description: "The content of the notification data",
    },
    notificationType: {
      type: "string",
      label: "Notification Type",
      description: "The type of the notification",
      optional: true,
    },
    time: {
      type: "string",
      label: "Time",
      description: "The time when the notification was received",
      optional: true,
    },
    leadId: {
      type: "string",
      label: "Lead ID",
      description: "The unique identifier for the lead",
    },
    leadName: {
      type: "string",
      label: "Lead Name",
      description: "The name of the lead",
      optional: true,
    },
    source: {
      type: "string",
      label: "Source",
      description: "The source where the lead was collected",
      optional: true,
    },
    notificationId: {
      type: "string",
      label: "Notification ID",
      description: "The unique identifier for the notification",
    },
    campaignId: {
      type: "string",
      label: "Campaign ID",
      description: "The unique identifier for the campaign",
    },
  },
  methods: {
    _baseUrl() {
      return "https://proofly.io/api";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "X-Api-Key": this.$auth.api_key,
        },
      });
    },
    async getNotificationById({ notificationId }) {
      return this._makeRequest({
        path: `/data/${notificationId}`,
      });
    },
    async switchCampaignStatus({ campaignId }) {
      return this._makeRequest({
        method: "PUT",
        path: `/campaign/${campaignId}`,
      });
    },
  },
  version: "0.0.{{ts}}",
};
