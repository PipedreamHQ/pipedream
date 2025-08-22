export default {
  type: "app",
  app: "uk_gov_vehecle_enquiry_api",
  propDefinitions: {},
  methods: {
    // this.$auth contains connected account data
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
