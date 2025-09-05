export default {
  type: "app",
  app: "cdc_national_environmental_public_health_tracking",
  propDefinitions: {},
  methods: {
    // this.$auth contains connected account data
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
