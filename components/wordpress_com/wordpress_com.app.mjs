
import methods from "./common/methods.mjs";

export default {
  type: "app",
  app: "wordpress_com",
  propDefinitions: {},
  methods: {

    ...methods,
    // this.$auth contains connected account data
    authKeys() {
      console.log(Object.keys(this.$auth));
    },

  },
};
