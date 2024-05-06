import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "better_stack",
  propDefinitions: {
    policyId: {
      type: "string",
      label: "Policy ID",
      description: "The ID of the escalation policy with which you'd like to escalate this incident",
      optional: true,
      async options({
        page, prevContext: { hasNext },
      }) {
        if (hasNext === false) {
          return [];
        }
        const {
          data,
          pagination: { next },
        } = await this.listPolicies({
          params: {
            page: page + 1,
          },
        });
        return {
          options: data.map(({
            id: value, attributes: { name: label },
          }) => ({
            label,
            value,
          })),
          context: {
            hasNext: !!next,
          },
        };
      },
    },
    incidentId: {
      type: "string",
      label: "Incident ID",
      description: "The unique identifier for the incident.",
      async options({
        page, prevContext: { hasNext },
      }) {
        if (hasNext === false) {
          return [];
        }
        const {
          data,
          pagination: { next },
        } = await this.listIncidents({
          params: {
            page: page + 1,
          },
        });
        return {
          options: data.map(({
            id: value, attributes: { name: label },
          }) => ({
            label,
            value,
          })),
          context: {
            hasNext: !!next,
          },
        };
      },
    },
  },
  methods: {
    getUrl(path) {
      return `${constants.BASE_URL}${constants.VERSION_PATH}${path}`;
    },
    getHeaders(headers) {
      return {
        ...headers,
        "Authorization": `Bearer ${this.$auth.uptime_token}`,
        "Content-Type": "application/json",
      };
    },
    _makeRequest({
      $ = this, path, headers, ...args
    } = {}) {
      return axios($, {
        ...args,
        url: this.getUrl(path),
        headers: this.getHeaders(headers),
      });
    },
    post(args = {}) {
      return this._makeRequest({
        method: "POST",
        ...args,
      });
    },
    listPolicies(args = {}) {
      return this._makeRequest({
        path: "/policies",
        ...args,
      });
    },
    listIncidents(args = {}) {
      return this._makeRequest({
        path: "/incidents",
        ...args,
      });
    },
  },
};
