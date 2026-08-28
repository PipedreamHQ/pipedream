import { axios } from "@pipedream/platform";

export default {
  props: {
    amount: {
      type: "integer",
      label: "Monthly Limit",
      description: "The monthly limit, in the currency's smallest denomination — `100000` is $1,000.00 in USD.",
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
      path: `/v2/users/${encodeURIComponent(user.value || user)}/limit`,
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
