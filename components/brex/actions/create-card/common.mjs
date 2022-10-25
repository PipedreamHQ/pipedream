import options from "../../common-options.mjs";
import { axios } from "@pipedream/platform";

export default {
  props: {
    cardName: {
      type: "string",
      label: "Card Name",
      description: "Card Name",
    },
    cardType: {
      type: "string",
      label: "Card Type",
      description: "Card Type",
      options: options.cardType,
    },
    limitType: {
      type: "string",
      label: "Limit Type",
      description: "`limit_type = CARD` for vendor cards. Vendor cards must have a `card_type` of `VIRTUAL` and do not rely on the user specific limit. For corporate cards, `limit_type = USER`.",
      options: options.limitType,
      reloadProps: true,
    },
  },
  async additionalProps() {
    if (this.limitType === "USER") {
      return {};
    }

    return {
      amount: {
        type: "integer",
        label: "Spend Limit Amount",
        description: "The amount of money, in the smallest denomination of the currency indicated by currency. For example, when currency is USD, amount is in cents.",
      },
      currency: {
        type: "string",
        label: "Spend Limit Currency",
        description: "The type of currency, in [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217) format. Default to `USD` if not specified",
        optional: true,
      },
      spendDuration: {
        type: "string",
        label: "Spend Duration",
        description: "Spend limit refresh frequency.",
        options: options.spendDuration,
      },
      reason: {
        type: "string",
        label: "Spend Limit Reason",
        optional: true,
      },
      lockAfterDate: {
        type: "string",
        label: "Spend Limit Lock After Date",
        description: "Use `yyyy-mm-dd` format.",
        optional: true,
      },
    };
  },
  async run ({ $ }) {
    const {
      user,
      cardName,
      cardType,
      limitType,
      amount,
      currency,
      spendDuration,
      reason,
      lockAfterDate,
    } = this;

    const res = await axios($, this.brexApp._getAxiosParams({
      method: "POST",
      path: "/v2/cards",
      data: {
        owner: {
          type: "USER",
          user_id: user.value || user,
        },
        card_name: cardName,
        card_type: cardType,
        limit_type: limitType,
        spend_controls: limitType === "CARD"
          ? {
            spend_limit: {
              amount,
              currency,
            },
            spend_duration: spendDuration,
            reason,
            lock_after_date: lockAfterDate,
          }
          : null,
      },
    }));

    $.export("$summary", `Card successfully create for "${user.label || user}".`);
    return res;
  },
};
