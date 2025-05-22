import { UtopianLabs } from "utopianlabs";

export default {
  type: "app",
  app: "utopian_labs",
  propDefinitions: {},
  methods: {
    _getClient() {
      return new UtopianLabs({
        apiKey: this.$auth.api_key,
      });
    },
  },
};
