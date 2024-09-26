import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "lastpass",
  propDefinitions: {
    username: {
      type: "string",
      label: "Username",
      description: "Username/Email of a user",
      async options({ page }) {
        const { Users: users } = await this.getUserData({
          data: {
            data: {
              pageindex: page,
            },
          },
        });
        const options = [];
        for (const id in users) {
          options.push(users[id].username);
        }
        return options;
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://lastpass.com/enterpriseapi.php";
    },
    _authData(data) {
      return {
        ...data,
        cid: `${this.$auth.account_number}`,
        provhash: `${this.$auth.prov_hash}`,
      };
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        data,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method: "POST",
        url: this._baseUrl(),
        headers: {
          "Content-Type": "application/json",
        },
        data: this._authData(data),
      });
    },
    getUserData({
      data = {}, ...opts
    }) {
      data.cmd = "getuserdata";
      return this._makeRequest({
        data,
        ...opts,
      });
    },
    getEvents({
      data = {}, ...opts
    }) {
      data.cmd = "reporting";
      return this._makeRequest({
        data,
        ...opts,
      });
    },
    manageUserGroup({
      data = {}, ...opts
    }) {
      data.cmd = "batchchangegrp";
      return this._makeRequest({
        data,
        ...opts,
      });
    },
    deactivateOrDeleteUser({
      data, ...opts
    }) {
      data.cmd = "deluser";
      return this._makeRequest({
        data,
        ...opts,
      });
    },
  },
};
