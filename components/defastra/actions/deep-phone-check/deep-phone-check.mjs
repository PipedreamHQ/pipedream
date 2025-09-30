import common from "../common/base.mjs";

export default {
  ...common,
  key: "defastra-deep-phone-check",
  name: "Deep Phone Check",
  description: "Conducts a risk assessment and digital lookup for a provided phone number. Returns a risk score indicating if the number is disposable, risky, or safe, along with carrier details, location, and potential social profiles. [See the documentation](https://docs.defastra.com/reference/deep-phone-check)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    ...common.props,
    phoneNumber: {
      propDefinition: [
        common.props.defastra,
        "phoneNumber",
      ],
    },
  },
  methods: {
    getFn() {
      return this.defastra.performPhoneRiskAnalysis;
    },
    getData() {
      return {
        phone: this.phoneNumber,
      };
    },
  },
};
