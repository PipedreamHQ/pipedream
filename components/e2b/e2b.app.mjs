import { Sandbox } from "@e2b/code-interpreter";

export default {
  type: "app",
  app: "e2b",
  methods: {
    getSandbox() {
      process.env.E2B_API_KEY = this.$auth.api_key;
      return Sandbox.create();
    },
    async runCode(code) {
      const sandbox = await this.getSandbox();
      return sandbox.runCode(code);
    },
  },
};
