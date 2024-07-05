export default {
  type: "app",
  app: "universal_summarizer_by_kagi",
  propDefinitions: {},
  methods: {
    // this.$auth contains connected account data
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
