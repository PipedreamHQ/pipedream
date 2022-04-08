import { axios } from "@pipedream/platform";
export default {
  type: "app",
  app: "strava",
  methods: {
    _getHeaders(headers = {}) {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        "Content-Type": "application/json",
        "user-agent": "@PipedreamHQ/pipedream v0.1",
        ...headers,
      };
    },
    _getUrl(path) {
      return `https://www.strava.com/api/v3${path}`;
    },
    async _makeRequest({
      $,
      path,
      headers,
      ...otherConfig
    } = {}) {
      const config = {
        url: this._getUrl(path),
        headers: this._getHeaders(headers),
        ...otherConfig,
      };
      return axios($ ?? this, config);
    },
    async getAuthenticatedAthlete({
      $,
      ...otherConfig
    } = {}) {
      return await this._makeRequest({
        $,
        method: "GET",
        path: "/athlete",
        params: otherConfig,
      });
    },
    async getActivity({
      $,
      activityId,
      ...otherConfig
    } = {}) {
      return (
        await this._makeRequest({
          $,
          method: "GET",
          path: `/activities/${activityId}`,
          params: otherConfig,
        })
      );
    },
    async getStats({
      $,
      athlete,
      ...otherConfig
    } = {}) {
      return await this._makeRequest({
        $,
        method: "GET",
        path: `/athletes/${athlete.id}/stats`,
        params: otherConfig,
      });
    },
    async createNewActivity({
      $,
      ...otherConfig
    }) {
      return await this._makeRequest({
        $,
        method: "POST",
        path: "/activities",
        data: otherConfig,
      });
    },
    async updateActivity({
      $,
      activityId,
      ...otherConfig
    } = {}) {
      return await this._makeRequest({
        $,
        method: "PUT",
        path: `/activities/${activityId}`,
        data: otherConfig,
      });
    },
    async listActivities(args = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/activities",
        ...args,
      });
    },
    async *getResourcesStream({
      resourceFn,
      resourceFnArgs,
      maxItems = 200,
    }) {
      let page = 1;
      let totalCount = 0;
      while (true) {
        const nextResources = await resourceFn({
          ...resourceFnArgs,
          params: {
            ...resourceFnArgs.params,
            page,
          },
        });
        if (!nextResources) {
          throw new Error("No response from Strava API.");
        }
        page += 1;
        for (const resource of nextResources) {
          if (totalCount < maxItems) {
            yield resource;
            totalCount += 1;
          }
        }
        if (!nextResources.length || (maxItems && totalCount >= maxItems)) {
          return;
        }
      }
    },
  },
};
