import { axios } from "@pipedream/platform";

export default {
  props: {
    amount: {
      type: "integer",
      label: "Monthly Limit",
      description: "The amount of money, in the smallest denomination of the currency indicated by currency. For example, when currency is USD, amount is in cents (`1000.00`).",
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
      path: `/v2/users/${user.value || user}/limit`,
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
