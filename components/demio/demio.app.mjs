export default {
    type: "app",
    app: "demio",
    propDefinitions: {},
    methods: {
      // this.$auth contains connected account data
      authKeys() {
        console.log(Object.keys(this.$auth));
      },
    },
  };