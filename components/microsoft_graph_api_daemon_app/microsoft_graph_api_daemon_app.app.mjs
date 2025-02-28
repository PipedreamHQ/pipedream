export default {
  type: "app",
  app: "microsoft_graph_api_daemon_app",
  propDefinitions: {},
  methods: {
    // this.$auth contains connected account data
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};