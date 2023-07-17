import { defineApp } from "@pipedream/types";

export default defineApp({
  type: "app",
  app: "open_exchange_rates",
  propDefinitions: {},
  methods: {
    // this.$auth contains connected account data
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
});