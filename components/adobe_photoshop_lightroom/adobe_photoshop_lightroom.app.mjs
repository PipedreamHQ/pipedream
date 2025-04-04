export default {
  type: "app",
  app: "adobe_photoshop_lightroom",
  propDefinitions: {},
  methods: {
    // this.$auth contains connected account data
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
