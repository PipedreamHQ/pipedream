import { defineApp } from "@pipedream/types";
import { axios } from "@pipedream/platform";

export default defineApp({
  type: "app",
  app: "google_recaptcha",
  propDefinitions: {},
  methods: {
    async validateRecaptcha({
      $,
      params,
    } = {
      params: {},
      $: this,
    }) {
      return axios($, {
        url: "https://www.google.com/recaptcha/api/siteverify",
        params: {
          secret: this.$auth.secret,
          ...params,
        },
      });
    },
  },
});
