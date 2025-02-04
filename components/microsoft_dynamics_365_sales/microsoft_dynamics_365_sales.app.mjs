export default {
  type: "app",
  app: "microsoft_dynamics_365_sales",
  propDefinitions: {},
  methods: {
    // this.$auth contains connected account data
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};