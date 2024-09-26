import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "wubook_ratechecker",
  propDefinitions: {
    competitorId: {
      type: "string",
      label: "Competitor",
      description: "Identifier of a competitor",
      async options() {
        const competitors = await this.getMonitoredCompetitors();
        return competitors?.map(({
          name, competitor_id: id,
        }) => ({
          label: name,
          value: id,
        })) || [];
      },
    },
    stayId: {
      type: "string",
      label: "Stay",
      description: "Identifier of a stay",
      async options({ competitorId }) {
        const stays = await this.getStays({
          params: {
            competitor_id: competitorId,
          },
        });
        return stays?.map(({ stay_id: id }) =>  id ) || [];
      },
    },
    length: {
      type: "string",
      label: "Length",
      description: "Length of the snapshot",
      options: constants.LENGTH_OPTIONS,
    },
  },
  methods: {
    _baseUrl() {
      return "https://wubook.net/wrpeeker/api";
    },
    _authParams() {
      return {
        token: this.$auth.api_token,
      };
    },
    async _makeRequest({
      $ = this,
      params,
      path,
      ...args
    }) {
      const config = {
        url: `${this._baseUrl()}${path}`,
        params: {
          ...this._authParams(),
          ...params,
        },
        ...args,
      };
      return axios($, config);
    },
    getMonitoredCompetitors(args = {}) {
      return this._makeRequest({
        path: "/user",
        ...args,
      });
    },
    getStays(args = {}) {
      return this._makeRequest({
        path: "/competitor",
        ...args,
      });
    },
    addManualSnapshot(args = {}) {
      return this._makeRequest({
        path: "/manual_snapshot",
        ...args,
      });
    },
  },
};
