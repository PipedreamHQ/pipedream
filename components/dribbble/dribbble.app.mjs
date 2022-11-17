import axios from "axios";

export default {
  type: "app",
  app: "dribbble",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://api.dribbble.com/v2";
    },
    _authToken() {
      return this.$auth.oauth_access_token;
    },
    _headers() {
      return {
        Authorization: `Bearer ${this._authToken()}`,
      };
    },
    async listShots() {
      const url = `${this._baseUrl()}/user/shots`;
      const requestConfig = {
        headers: this._headers(),
      };
      const { data } = await axios.get(url, requestConfig);
      return data;
    },
  },
};
