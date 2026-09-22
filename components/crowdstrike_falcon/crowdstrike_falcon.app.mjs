import { axios } from "@pipedream/platform";
import {
  DEFAULT_LIMIT,
  LIMIT_MAX_DEFAULT,
} from "./common/constants.mjs";

export default {
  type: "app",
  app: "crowdstrike_falcon",
  propDefinitions: {
    fqlFilter: {
      type: "string",
      label: "FQL Filter",
      description: "Optional FQL filter. Combine terms with `+`.",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: `Maximum number of results to return (1-${LIMIT_MAX_DEFAULT}). Default: ${DEFAULT_LIMIT}.`,
      optional: true,
      default: DEFAULT_LIMIT,
      min: 1,
      max: LIMIT_MAX_DEFAULT,
    },
    offset: {
      type: "integer",
      label: "Offset",
      description: "Offset for pagination. Default: 0.",
      optional: true,
      default: 0,
      min: 0,
      max: LIMIT_MAX_DEFAULT,
    },
    sort: {
      type: "string",
      label: "Sort",
      description: "Optional sort in `field|direction` form, e.g. `created_timestamp|desc`.",
      optional: true,
    },
    deviceIds: {
      type: "string[]",
      label: "Device IDs",
      description: "Device IDs to act on. Run **Search Hosts** to obtain these IDs.",
    },
  },
  methods: {
    _baseUrl() {
      return this.$auth.base_url;
    },
    async _makeRequest({
      $ = this,
      path,
      method = "GET",
      params,
      data,
      headers,
      ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        method,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
        params,
        data,
        ...args,
      });
    },
    // Alerts - GET /alerts/queries/alerts/v1 (returns composite_ids)
    async searchAlerts(args = {}) {
      return this._makeRequest({
        path: "/alerts/queries/alerts/v2",
        ...args,
      });
    },
    // Alerts - POST /alerts/entities/alerts/v1 (body: composite_ids -> full records)
    async getAlerts(args = {}) {
      return this._makeRequest({
        path: "/alerts/entities/alerts/v2",
        ...args,
      });
    },
    // Hosts combined (full device records) - GET /devices/combined/devices/v1
    async searchHosts(args = {}) {
      return this._makeRequest({
        path: "/devices/combined/devices/v1",
        ...args,
      });
    },
    // Hosts entities - POST /devices/entities/devices/v2 (body: ids -> full records)
    async getHosts(args = {}) {
      return this._makeRequest({
        path: "/devices/entities/devices/v2",
        ...args,
      });
    },
    // Host action - POST /devices/entities/devices-actions/v2
    // action_name is a query param; ids are in the request body.
    async performHostAction(args = {}) {
      return this._makeRequest({
        path: "/devices/entities/devices-actions/v2",
        method: "POST",
        ...args,
      });
    },
    // RTR session - POST /real-time-response/entities/sessions/v1
    async initRtrSession(args = {}) {
      return this._makeRequest({
        path: "/real-time-response/entities/sessions/v1",
        method: "POST",
        ...args,
      });
    },
    // RTR command - POST /real-time-response/entities/command/v1
    async executeRtrCommand(args = {}) {
      return this._makeRequest({
        path: "/real-time-response/entities/command/v1",
        method: "POST",
        ...args,
      });
    },
    // RTR command status - GET /real-time-response/entities/command/v1
    async getRtrCommandStatus(args = {}) {
      return this._makeRequest({
        path: "/real-time-response/entities/command/v1",
        ...args,
      });
    },
  },
};
