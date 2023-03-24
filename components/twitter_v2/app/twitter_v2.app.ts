import { defineApp } from "@pipedream/types";

export default defineApp({
  type: "app",
  app: "twitter_v2",
  propDefinitions: {},
  methods: {
    // this.$auth contains connected account data
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
});