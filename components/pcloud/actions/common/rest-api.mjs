import pcloud from "../../pcloud.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  props: {
    pcloud,
    username: {
      type: "string",
      label: "Username",
    },
    password: {
      type: "string",
      label: "Password",
    },
  },
  methods: {
    async getAuth($) {
      const { auth } = await axios($, {
        url: `https://${this.pcloud.$auth.hostname}/userinfo?getauth=1&logout=1&username=${this.username}&password=${this.password}`,
      });
      return auth;
    },
  },
};
