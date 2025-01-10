export default {
  type: "app",
  app: "linkup",
  methods: {
    getApiKey() {
      return this.$auth.api_key;
    },
  },
};
