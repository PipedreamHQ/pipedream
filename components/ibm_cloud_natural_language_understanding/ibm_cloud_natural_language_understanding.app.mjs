export default {
  type: "app",
  app: "ibm_cloud_natural_language_understanding",
  propDefinitions: {},
  methods: {
    // this.$auth contains connected account data
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
