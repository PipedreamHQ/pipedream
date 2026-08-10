// x-pd-ai: optimized
import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "mixpanel_service_account",
  propDefinitions: {
    eventName: {
      type: "string",
      label: "Event Name",
      description: "The name of a single event, exactly as it is tracked in Mixpanel (for example, `Signed Up`). Event names are case-sensitive. Use **List Events** to discover the event names in this project.",
    },
    fromDate: {
      type: "string",
      label: "From Date",
      description: "Start of the query window in `YYYY-MM-DD` format (for example, `2026-07-01`). Inclusive, and interpreted in the project's timezone.",
    },
    toDate: {
      type: "string",
      label: "To Date",
      description: "End of the query window in `YYYY-MM-DD` format (for example, `2026-07-29`). Inclusive, and interpreted in the project's timezone.",
    },
    where: {
      type: "string",
      label: "Where",
      description: "A segmentation expression that filters which events are counted. Example: `properties[\"$browser\"] == \"Chrome\"`. Use **List Event Properties** to discover property names and **List Event Property Values** to discover the values they take. [See the expression syntax](https://docs.mixpanel.com/reference/segmentation-expressions)",
      optional: true,
    },
    on: {
      type: "string",
      label: "Segment On",
      description: "A segmentation expression to break the results down by. Example: `properties[\"$city\"]`. Use **List Event Properties** to discover property names. [See the expression syntax](https://docs.mixpanel.com/reference/segmentation-expressions)",
      optional: true,
    },
    workspaceId: {
      type: "integer",
      label: "Workspace ID",
      description: "The ID of the Data View to query. Only needed for projects that use [Data Views](https://help.mixpanel.com/hc/en-us/articles/360043782572-Data-Views); leave it empty otherwise. It is the segment after `/view/` in a project URL such as `https://mixpanel.com/project/1234/view/5678/app/boards`.",
      optional: true,
    },
    distinctIds: {
      type: "string[]",
      label: "Distinct IDs",
      description: "One or more Mixpanel `distinct_id` values identifying the user profiles to look up. Use **Query Profiles** to find `distinct_id` values by email or any other profile property.",
    },
    analysisType: {
      type: "string",
      label: "Analysis Type",
      description: "How the events are counted. Use `unique` to answer \"how many users\" and `general` to answer \"how many times\".",
      options: constants.ANALYSIS_TYPES,
      default: constants.GENERAL_ANALYSIS_TYPE,
    },
    unit: {
      type: "string",
      label: "Unit",
      description: "The size of each bucket in the returned series.",
      options: constants.REPORT_TIME_UNITS,
      optional: true,
    },
    interval: {
      type: "integer",
      label: "Interval",
      description: "The number of days each bucket in the returned series covers, for example `7`. Defaults to 1. This is an alternate way of expressing Unit - set one or the other, not both.",
      min: 1,
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "The maximum number of results to return.",
      min: 1,
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return `https://${this.$auth.region}${constants.QUERY_API_PATH}`;
    },
    _headers(headers) {
      const credentials = Buffer
        .from(`${this.$auth.username}:${this.$auth.secret}`)
        .toString("base64");
      return {
        "Authorization": `Basic ${credentials}`,
        "Accept": "application/json",
        ...headers,
      };
    },
    _formBody(data) {
      const body = new URLSearchParams();
      for (const [
        key,
        value,
      ] of Object.entries(data)) {
        if (value != null) {
          body.append(key, value);
        }
      }
      return body.toString();
    },
    _makeRequest({
      $ = this, path, params, headers, ...args
    } = {}) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(headers),
        params: {
          project_id: this.$auth.project_id,
          ...params,
        },
        ...args,
      });
    },
    listEvents(args = {}) {
      return this._makeRequest({
        path: "/events/names",
        ...args,
      });
    },
    listEventProperties(args = {}) {
      return this._makeRequest({
        path: "/events/properties/top",
        ...args,
      });
    },
    listEventPropertyValues(args = {}) {
      return this._makeRequest({
        path: "/events/properties/values",
        ...args,
      });
    },
    aggregateEventCounts(args = {}) {
      return this._makeRequest({
        path: "/events",
        ...args,
      });
    },
    queryInsightsReport(args = {}) {
      return this._makeRequest({
        path: "/insights",
        ...args,
      });
    },
    listSavedFunnels(args = {}) {
      return this._makeRequest({
        path: "/funnels/list",
        ...args,
      });
    },
    queryFunnelReport(args = {}) {
      return this._makeRequest({
        path: "/funnels",
        ...args,
      });
    },
    queryRetentionReport(args = {}) {
      return this._makeRequest({
        path: "/retention",
        ...args,
      });
    },
    getProfileEventActivity(args = {}) {
      return this._makeRequest({
        path: "/stream/query",
        ...args,
      });
    },
    listSavedCohorts(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/cohorts/list",
        ...args,
      });
    },
    queryProfiles({
      data = {}, ...args
    } = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/engage",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: this._formBody(data),
        ...args,
      });
    },
  },
};
