import brexApp from "../../brex_staging.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  name: "Set Limit for User",
  description: "Sets the monthly limit for a user. [See the docs here](https://developer.brex.com/openapi/team_api/#operation/setUserLimit).",
  key: "brex_staging-set-limit-for-user",
  version: "0.0.4",
  type: "action",
  props: {
    brexApp,
    user: {
      propDefinition: [
        brexApp,
        "user",
      ],
      label: "User",
      description: "User to set the new limit",
      withLabel: true,
    },
    amount: {
      type: "integer",
      label: "Monthly Limit",
      description: "The amount of money, in the smallest denomination of the currency indicated by currency. For example, when currency is USD, amount is in cents.",
    },
    currency: {
      type: "string",
      label: "Currency",
      description: "The type of currency, in [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217) format. Default to `USD` if not specified",
      optional: true,
    },
  },
  async run ({ $ }) {
    const {
      user,
      amount,
      currency,
    } = this;

    const res = await axios($, this.brexApp._getAxiosParams({
      method: "POST",
      path: `/users/${user.value || user}/limit`,
      data: {
        monthly_limit: {
          amount,
          currency,
        },
      },
    }));

    $.export("$summary", `Monthly limit for ${user.label || user} successfully updated`);
    return res;
  },
};
