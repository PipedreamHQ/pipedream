/*
const data = {
      "api_key": `${this.tookan.$auth.api_key}`,
    }
    return await axios($, {
      method: "post",
      url: `https://api.tookanapp.com/v2/get_user_details`,
      headers: {
        "Content-Type": `application/json`,
      },
      data,
    }) 
*/

import { defineApp } from "@pipedream/types";

export default defineApp({
  type: "app",
  app: "tookan",
  propDefinitions: {},
  methods: {
    // this.$auth contains connected account data
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
});
