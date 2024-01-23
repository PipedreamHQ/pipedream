import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "timebuzzer",
  propDefinitions: {
    activity: {
      type: "string",
      label: "Activity",
      description: "The activity to be created or updated in timebuzzer",
      async options() {
        const { data } = await this.listActivities();
        return data.map((activity) => ({
          label: activity.name,
          value: activity.id,
        }));
      },
    },
    update: {
      type: "object",
      label: "Update",
      description: "The new data for the existing activity to be updated in timebuzzer",
      optional: true,
    },
    filter: {
      type: "object",
      label: "Filter",
      description: "The filter to narrow the results when retrieving a list of all activities in timebuzzer",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.timebuzzer.com/v1";
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
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    async createActivity(activity) {
      return this._makeRequest({
        method: "POST",
        path: "/activities",
        data: activity,
      });
    },
    async updateActivity(activity, update) {
      return this._makeRequest({
        method: "PUT",
        path: `/activities/${activity}`,
        data: update,
      });
    },
    async listActivities(filter = {}) {
      return this._makeRequest({
        path: "/activities",
        params: filter,
      });
    },
  },
};
