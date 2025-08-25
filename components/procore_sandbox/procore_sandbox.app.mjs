import procore from "@pipedream/procore";
import constants from "@pipedream/procore/common/constants.mjs";

export default {
  ...procore,
  app: "procore_sandbox",
  methods: {
    ...procore.methods,
    getEnvironment() {
      return constants.ENVIRONMENT.SANDBOX;
    },
  },
};
