export default {
  type: "app",
  app: "yahoo_finance_by_apidojo",
  propDefinitions: {},
  methods: {
    // this.$auth contains connected account data
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
