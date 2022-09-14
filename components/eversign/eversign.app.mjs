export default {
  type: "app",
  app: "eversign",
  propDefinitions: {},
  methods: {
    // this.$auth contains connected account data
    authKeys() {
      console.log((this.$auth));
    },
  },
};
