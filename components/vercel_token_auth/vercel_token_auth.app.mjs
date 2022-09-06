import base from "../vercel/vercel.app.mjs";

export default {
  ...base,
  type: "app",
  app: "vercel_token_auth",
  methods: {
    ...base.methods,
    _auth() {
      return {
        Authorization: `Bearer ${this.$auth.personal_access_token}`,
      };
    },
  },
};
