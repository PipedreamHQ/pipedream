import brexApp from "../../brex.app.mjs";
import options from "../../common/options.mjs";
import {
  axios, ConfigurationError,
} from "@pipedream/platform";

export default {
  props: {
    cardName: {
      type: "string",
      label: "Card Name",
      description: "A label for the card, shown in the Brex dashboard and printed on physical cards, e.g. `AWS Vendor Card`.",
    },
    cardType: {
      type: "string",
      label: "Card Type",
      description: "Must be `VIRTUAL`, for a card usable immediately. `PHYSICAL` is not supported yet — Brex requires a mailing address to ship a card and this action does not collect one, so selecting it raises a configuration error.",
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
        description: "The spend limit, in the currency's smallest denomination — `2500` is $25.00 in USD.",
      },
      currency: {
        type: "string",
        label: "Spend Limit Currency",
        description: "The type of currency, in [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217) format. Default to `USD` if not specified",
        optional: true,
      },
      spendDuration: {
        propDefinition: [
          brexApp,
          "spendDuration",
        ],
        optional: false,
      },
      reason: {
        type: "string",
        label: "Spend Limit Reason",
        description: "A note explaining what the card is for, shown alongside the limit in Brex, e.g. `AWS monthly hosting`.",
        optional: true,
      },
      lockAfterDate: {
        type: "string",
        label: "Spend Limit Lock After Date",
        description: "The date the card stops accepting purchases, in `yyyy-mm-dd` format, e.g. `2026-12-31`. Omit for a card that never locks.",
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

    if (cardType === "PHYSICAL") {
      throw new ConfigurationError("Physical cards require a mailing address, which this action does not collect yet. Set Card Type to `VIRTUAL`.");
    }

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
