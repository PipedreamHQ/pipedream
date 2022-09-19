import app from "../gorgias/gorgias.app.mjs";

export default {
  ...app,
  type: "app",
  app: "gorgias_oauth",
  methods: {
    ...app.methods,
    _defaultConfig({
      path, method = "get", params = {}, data = undefined,
    }) {
      const config = {
        url: `https://${this.$auth.domain}.gorgias.com/api/${path}`,
        headers: {
          "Content-type": "application/json",
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
        method,
        params,
        data,
      };
      return config;
    },
  },
};
