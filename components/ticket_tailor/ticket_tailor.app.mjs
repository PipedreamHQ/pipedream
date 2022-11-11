export default {
  type: "app",
  app: "ticket_tailor",
  propDefinitions: {},
  methods: {
    // this.$auth contains connected account data
    authKeys() {
      console.log((this.$auth));
    },
  },
};
