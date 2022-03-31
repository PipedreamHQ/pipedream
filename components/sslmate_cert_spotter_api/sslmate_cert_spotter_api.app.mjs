export default {
  type: "app",
  app: "sslmate_cert_spotter_api",
  propDefinitions: {},
  methods: {
    // this.$auth contains connected account data
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
