// x-pd-ai: optimized
import { axios } from "@pipedream/platform";
import {
  BASE_URL,
  MAX_ANALYTICS_RANGE_DAYS,
} from "./common/constants.mjs";

export default {
  type: "app",
  app: "dappier",
  propDefinitions: {
    query: {
      type: "string",
      label: "Query",
      description: "The natural-language query or prompt to send to the Dappier model.",
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: `Inclusive start of the reporting window in \`YYYY-MM-DD\` format, interpreted as **UTC** (e.g. \`2026-08-01\`). Optional - when omitted the API defaults to the last 7 days (UTC), i.e. today and the six prior days. The window between Start Date and End Date must not exceed ${MAX_ANALYTICS_RANGE_DAYS} days.`,
      optional: true,
    },
    endDate: {
      type: "string",
      label: "End Date",
      description: `Inclusive end of the reporting window in \`YYYY-MM-DD\` format, interpreted as **UTC** (e.g. \`2026-08-28\`). Optional - defaults to today if omitted. Must be on or after Start Date, and the window between them must not exceed ${MAX_ANALYTICS_RANGE_DAYS} days.`,
      optional: true,
    },
    widgetId: {
      type: "string",
      label: "Widget ID",
      description: "Filter results to a single widget by its external ID (e.g. `wd_92831`). Optional - omit to include all widgets. The Dappier API exposes no listing endpoint; find widget IDs in the Dappier platform at https://platform.dappier.com.",
      optional: true,
    },
    placementId: {
      type: "string",
      label: "Placement ID",
      description: "Filter results to a single placement by its external ID. Optional - omit to include all placements. The Dappier API exposes no listing endpoint; find placement IDs in the Dappier platform at https://platform.dappier.com.",
      optional: true,
    },
    deploymentType: {
      type: "string",
      label: "Deployment Type",
      description: "Filter by deployment type, exact match (e.g. `brand_agent`, `sponsored_conversation`, `embed`, `widget`). Optional - omit to include all deployment types.",
      optional: true,
    },
    creativeId: {
      type: "string",
      label: "Creative ID",
      description: "Filter by DSP/ad-tracking creative ID. Optional - omit to include all creatives.",
      optional: true,
    },
    lineItemId: {
      type: "string",
      label: "Line Item ID",
      description: "Filter by DSP/ad-tracking line item ID. Optional - omit to include all line items.",
      optional: true,
    },
    publisherId: {
      type: "string",
      label: "Publisher ID",
      description: "Filter by publisher ID (Dianomi traffic only). Optional - omit to include all publishers.",
      optional: true,
    },
  },
  methods: {
    getUrl(path) {
      return `${BASE_URL}${path}`;
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: this.getUrl(path),
        headers: this._headers(),
        ...args,
      });
    },
    searchRealTimeData({
      aiModelId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/app/aimodel/${aiModelId}`,
        ...args,
      });
    },
    getAiRecommendations({
      dataModelId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/app/v2/search",
        params: {
          data_model_id: dataModelId,
        },
        ...args,
      });
    },
    getAskAiAnalytics(args = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/v1/analytics/ask-ai",
        ...args,
      });
    },
    getAskAiLogs(args = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/v1/analytics/ask-ai/logs",
        ...args,
      });
    },
    getSponsoredConversationsAnalytics(args = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/v1/analytics/sponsored-conversations",
        ...args,
      });
    },
    getSessionIntelligence(args = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/v1/analytics/session-intelligence",
        ...args,
      });
    },
  },
};
