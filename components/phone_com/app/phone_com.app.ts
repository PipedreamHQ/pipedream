import { defineApp } from "@pipedream/types";
import axios from "axios";

export default defineApp({
  type: "app",
  app: "phone_com",
  methods: {
    _httpRequest() {
      return axios({
        url: `https://api.phone.com/v4/accounts`,
        headers: {
          Authorization: `Bearer ${this.$auth.access_token}`,
        },
      })
    },
  },
});