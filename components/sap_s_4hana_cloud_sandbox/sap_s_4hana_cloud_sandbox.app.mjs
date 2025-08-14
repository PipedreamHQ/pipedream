export default {
  type: "app",
  app: "sap_s_4hana_cloud_sandbox",
  propDefinitions: {},
  methods: {
    // this.$auth contains connected account data
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};