import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "darkmoon",
  propDefinitions: {
    campaignId: {
      type: "string",
      label: "Campaign ID",
      description: "The ID of a Darkmoon campaign. Run the **List Campaigns** action first to look up a campaign `id`.",
      async options() {
        const { data: campaigns = [] } = await this.listCampaigns();
        return campaigns.map(({
          id, target, status,
        }) => ({
          label: `${target || id} (${status || "unknown"})`,
          value: id,
        }));
      },
    },
    findingId: {
      type: "string",
      label: "Finding ID",
      description: "The ID of a Darkmoon finding (vulnerability). Run the **List Findings** action first to look up a finding `id`.",
    },
    severity: {
      type: "string",
      label: "Severity",
      description: "Only return findings with this severity.",
      options: [
        "critical",
        "high",
        "medium",
        "low",
        "info",
      ],
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "Only return findings with this status. `exploited` and `confirmed` findings were proven by the agents, `unconfirmed` ones were not.",
      options: [
        "exploited",
        "confirmed",
        "unconfirmed",
        "remediated",
      ],
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      // Accept the server root or the full API root, with or without a trailing slash
      const baseUrl = String(this.$auth.base_url).replace(/\/+$/, "")
        .replace(/\/api\/v1$/, "");
      return `${baseUrl}/api/v1`;
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.api_token}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...opts,
      });
    },
    listCampaigns(opts = {}) {
      return this._makeRequest({
        path: "/campaigns",
        ...opts,
      });
    },
    getCampaign({
      campaignId, ...opts
    }) {
      return this._makeRequest({
        path: `/campaigns/${encodeURIComponent(campaignId)}`,
        ...opts,
      });
    },
    getCampaignReport({
      campaignId, ...opts
    }) {
      return this._makeRequest({
        path: `/campaigns/${encodeURIComponent(campaignId)}/report`,
        ...opts,
      });
    },
    listFindings(opts = {}) {
      return this._makeRequest({
        path: "/vulnerabilities",
        ...opts,
      });
    },
    getFinding({
      findingId, ...opts
    }) {
      return this._makeRequest({
        path: `/vulnerabilities/${encodeURIComponent(findingId)}`,
        ...opts,
      });
    },
    launchCampaign(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/run/campaign",
        ...opts,
      });
    },
  },
};
