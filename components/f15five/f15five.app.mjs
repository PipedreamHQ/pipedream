import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "f15five",
  propDefinitions: {
    user: {
      type: "string",
      label: "User",
      description: "Identifier of a user",
      async options({ page }) {
        const { results: users } = await this.listUsers({
          params: {
            page: page + 1,
          },
        });
        return users?.map(({
          id, first_name: firstName, last_name: lastName,
        }) => ({
          value: id,
          label: `${firstName} ${lastName}`,
        })) || [];
      },
    },
    checkin: {
      type: "string",
      label: "Check-in",
      description: "Identifier of a check-in",
      async options({
        page, userId,
      }) {
        const { results: checkins } = await this.listCheckins({
          params: {
            user_id: userId,
            page: page + 1,
          },
        });
        return checkins?.map(({ id }) => `${id}`) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://my.15five.com/api/public";
    },
    _headers() {
      return {
        "Authorization": `${this.$auth.api_key}`,
      };
    },
    async _makeRequest({
      $ = this,
      url,
      path,
      ...args
    }) {
      return axios($, {
        url: url || `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...args,
      });
    },
    getUser({
      userId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/user/${userId}`,
        ...args,
      });
    },
    getCheckin({
      checkinId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/report/${checkinId}`,
        ...args,
      });
    },
    listUsers(args = {}) {
      return this._makeRequest({
        path: "/user",
        ...args,
      });
    },
    listCheckins(args = {}) {
      return this._makeRequest({
        path: "/report",
        ...args,
      });
    },
    listOneOnOnes(args = {}) {
      return this._makeRequest({
        path: "/one-on-one",
        ...args,
      });
    },
    listHighFives(args = {}) {
      return this._makeRequest({
        path: "/high-five",
        ...args,
      });
    },
    createHighFive(args = {}) {
      return this._makeRequest({
        path: "/high-five",
        method: "POST",
        ...args,
      });
    },
  },
};
