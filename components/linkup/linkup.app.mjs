export default {
  type: "app",
  app: "linkup",
  methods: {
    _apiKey() {
      return this.$auth.api_key;
    },
  },
};
