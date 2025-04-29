import procore from "../procore/procore.app.mjs";
import constants from "../procore/common/constants.mjs";

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
