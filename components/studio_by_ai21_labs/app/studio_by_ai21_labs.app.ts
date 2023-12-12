import { defineApp } from "@pipedream/types";

export default defineApp({
  type: "app",
  app: "studio_by_ai21_labs",
  propDefinitions: {},
  methods: {
    // this.$auth contains connected account data
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
});