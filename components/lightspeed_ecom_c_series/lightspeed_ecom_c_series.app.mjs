export default {
  type: "app",
  app: "lightspeed_ecom_c_series",
  propDefinitions: {},
  methods: {
    // this.$auth contains connected account data
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
