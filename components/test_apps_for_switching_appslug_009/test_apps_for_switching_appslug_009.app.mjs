export default {
  type: "app",
  app: "test_apps_for_switching_appslug_009",
  propDefinitions: {},
  methods: {
    // this.$auth contains connected account data
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
