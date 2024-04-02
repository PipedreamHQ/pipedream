import defastra from "../../defastra.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "defastra-deep-email-check",
  name: "Deep Email Check",
  description: "Performs a risk analysis on a given email address and provides a risk score indicating if the email is disposable, risky, or safe. [See the documentation](https://docs.defastra.com/reference/deep-email-check)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    defastra,
    email: defastra.propDefinitions.email,
  },
  async run({ $ }) {
    const response = await this.defastra.performEmailRiskAnalysis({
      email: this.email,
    });

    if (!response.status) {
      throw new Error(`Error in response: ${response.error_message}`);
    }

    const {
      risk_level, risk_score, profile_found, online_profiles, creation_date, deliverability, signals, domain, data_breaches, request_id, wallet,
    } = response.deep_email_check;

    const result = {
      riskLevel: risk_level,
      riskScore: risk_score,
      profileFound: profile_found,
      onlineProfiles: online_profiles,
      creationDate: creation_date,
      deliverability,
      signals,
      domain,
      dataBreaches: data_breaches,
      requestId: request_id,
      wallet,
    };

    $.export("$summary", `Performed risk analysis on email: ${this.email}. Risk level: ${risk_level}, Risk score: ${risk_score}`);

    return result;
  },
};
