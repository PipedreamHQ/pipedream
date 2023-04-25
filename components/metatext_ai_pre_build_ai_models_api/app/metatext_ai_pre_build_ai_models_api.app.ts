import { defineApp } from "@pipedream/types";

export default defineApp({
  type: "app",
  app: "metatext_ai_pre_build_ai_models_api",
  propDefinitions: {},
  methods: {
    // this.$auth contains connected account data
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
});