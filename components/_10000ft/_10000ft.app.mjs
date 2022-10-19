export default {
  type: "app",
  app: "_10000ft",
  propDefinitions: {},
  methods: {
    // this.$auth contains connected account data
    authKeys() {
      console.log('Hello world')
      console.log(Object.keys(this.$auth));
    },
  },
};
