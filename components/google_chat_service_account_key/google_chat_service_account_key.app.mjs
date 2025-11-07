export default {
  type: "app",
  app: "google_chat_service_account_key",
  propDefinitions: {},
  methods: {
    // this.$auth contains connected account data
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};