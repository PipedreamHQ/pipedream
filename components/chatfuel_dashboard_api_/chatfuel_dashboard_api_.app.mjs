export default {
  type: "app",
  app: "chatfuel_dashboard_api_",
  propDefinitions: {},
  methods: {
    // this.$auth contains connected account data
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
