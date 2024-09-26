import email from "../../email.app.mjs";

export default {
  name: "New Email",
  version: "0.0.1",
  key: "email-new-email",
  description: "Get a unique address where you can send emails to trigger your workflow.",
  props: {
    email,
  },
  type: "source",
  methods: {},
  async run() {},
};
