import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "clevertap",
  propDefinitions: {
    from: {
      type: "integer",
      label: "From Date",
      description: "Start of the date range for which you want to retrieve campaigns. Use `YYYYMMDD` format.",
    },
    to: {
      type: "integer",
      label: "To Date",
      description: "End of the date range for which you want to retrieve campaigns. Use `YYYYMMDD` format.",
    },
    campaignId: {
      type: "integer",
      label: "Campaign ID",
      description: "The ID of the campaign you want to stop.",
      async options({
        from, to,
      }) {
        if (!from || !to) {
          return [];
        }
        const { targets } = await this.getCampaigns({
          data: {
            from,
            to,
          },
        });
        return targets?.map(({
          id, name,
        }) => ({
          label: name,
          value: id,
        })) || [];
      },
    },
  },
  methods: {
    _projectId() {
      return this.$auth.project_id;
    },
    _passCode() {
      return this.$auth.pass_code;
    },
    _region() {
      return this.$auth.region;
    },
    _apiUrl() {
      return `https://${this._region()}.clevertap.com/1`;
    },
    _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        ...args,
        headers: {
          ...args.headers,
          "X-CleverTap-Account-Id": this._projectId(),
          "X-CleverTap-Passcode": this._passCode(),
          "Content-Type": "application/json",
        },
      });
    },
    getCampaigns(args = {}) {
      return this._makeRequest({
        path: "/targets/list.json",
        method: "post",
        ...args,
      });
    },
    createCampaign(args = {}) {
      return this._makeRequest({
        path: "/targets/create.json",
        method: "post",
        ...args,
      });
    },
    getCampaignReport(args = {}) {
      return this._makeRequest({
        path: "/targets/result.json",
        method: "post",
        ...args,
      });
    },
    stopCampaign(args = {}) {
      return this._makeRequest({
        path: "/targets/stop.json",
        method: "post",
        ...args,
      });
    },
    uploadEvent(args = {}) {
      return this._makeRequest({
        path: "/upload",
        method: "post",
        ...args,
      });
    },
  },
};
