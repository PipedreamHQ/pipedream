export default {
  type: "app",
  app: "beebole",
  version: "0.0.1",
  propDefinitions: {},
  methods: {
    // this.$auth contains connected account data
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
