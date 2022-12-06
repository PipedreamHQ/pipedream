export default {
  type: "app",
  app: "superdocu",
  propDefinitions: {},
  methods: {
    // this.$auth contains connected account data
    authKeys() {
      console.log((this.$auth));
    },
  },
};
