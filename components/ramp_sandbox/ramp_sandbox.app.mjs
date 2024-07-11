import ramp from "../ramp/ramp.app.mjs";

export default {
  type: "app",
  app: "ramp_sandbox",
  propDefinitions: {
    ...ramp.propDefinitions,
  },
  methods: {
    ...ramp.methods,
    _baseUrl() {
      return "https://demo-api.ramp.com/developer/v1";
    },
    _getHeaders(headers) {
      return {
        ...headers,
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
  },
};
