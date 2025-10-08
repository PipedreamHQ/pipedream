import common from "../common/base.mjs";

export default {
  ...common,
  key: "defastra-deep-email-check",
  name: "Deep Email Check",
  description: "Performs a risk analysis on a given email address and provides a risk score indicating if the email is disposable, risky, or safe. [See the documentation](https://docs.defastra.com/reference/deep-email-check)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    ...common.props,
    email: {
      propDefinition: [
        common.props.defastra,
        "email",
      ],
    },
  },
  methods: {
    getFn() {
      return this.defastra.performEmailRiskAnalysis;
    },
    getData() {
      return {
        email: this.email,
      };
    },
  },
};
