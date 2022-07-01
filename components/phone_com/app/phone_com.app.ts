import { defineApp } from "@pipedream/types";

export default defineApp({
  type: "app",
  app: "phone_com",
  methods: {
    // this.$auth contains connected account data
    _getAuth() {
      return this.$auth;
    },
  },
});