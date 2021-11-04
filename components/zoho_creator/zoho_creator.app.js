module.exports = {
  type: "app",
  app: "zoho_creator",
  propDefinitions: {},
  methods: {
    _authToken() {
      return this.$auth.oauth_access_token;
    },
  },
};
