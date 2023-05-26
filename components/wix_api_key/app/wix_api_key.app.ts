import { defineApp } from "@pipedream/types";

export default defineApp({
  type: "app",
  app: "wix_api_key",
  propDefinitions: {},
  methods: {
    // this.$auth contains connected account data
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
});