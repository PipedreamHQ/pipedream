import methods from "./common/methods.mjs";

export default {
  type: "app",
  app: "google_search_console",
  propDefinitions: {},
  methods: {
    ...methods,
    // this.$auth contains connected account data
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
