export default {
  type: "app",
  app: "digitalocean_gradient_ai_serverless_inference",
  propDefinitions: {},
  methods: {
    // this.$auth contains connected account data
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};