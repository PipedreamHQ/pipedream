export default {
    type: "app",
    app: "repuso",
    propDefinitions: {},
    methods: {
      // this.$auth contains connected account data
      authKeys() {
        console.log(Object.keys(this.$auth));
      },
    },
  };