import { defineApp } from "@pipedream/types";

export default defineApp({
  type: "app",
  app: "automatic_data_extraction",
  propDefinitions: {},
  methods: {
    // this.$auth contains connected account data
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
});