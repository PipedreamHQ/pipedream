import { defineApp } from "@pipedream/types";

export default defineApp({
  type: "app",
  app: "danny_twilio_test",
  propDefinitions: {},
  methods: {
    // this.$auth contains connected account data
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
});