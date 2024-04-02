import defastra from "../../defastra.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "defastra-deep-phone-check",
  name: "Deep Phone Check",
  description: "Conducts a risk assessment and digital lookup for a provided phone number. Returns a risk score indicating if the number is disposable, risky, or safe, along with carrier details, location, and potential social profiles.",
  version: "0.0.1",
  type: "action",
  props: {
    defastra,
    phoneNumber: defastra.propDefinitions.phoneNumber,
  },
  async run({ $ }) {
    const response = await this.defastra.performPhoneRiskAnalysis({
      phoneNumber: this.phoneNumber,
    });

    $.export("$summary", "Successfully performed deep phone check");

    return response;
  },
};
