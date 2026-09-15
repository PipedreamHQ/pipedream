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
      description: "Must be `VIRTUAL`, for a card usable immediately. `PHYSICAL` is not supported — Brex requires a mailing address to ship a card and this action does not collect one.",
      options: options.cardType,
    },
    limitType: {
      type: "string",
      label: "Limit Type",
      description: "`limit_type = CARD` for vendor cards. Vendor cards must have a `card_type` of `VIRTUAL` and do not rely on the user specific limit. For corporate cards, `limit_type = USER`.",
      options: options.limitType,
    },
    amount: {
      type: "integer",
      label: "Spend Limit Amount",
      description: "The spend limit, in the currency's smallest denomination — `2500` is $25.00 in USD. Required when `Limit Type` is `CARD`; ignored when it is `USER`, because a corporate card draws on the cardholder's own limit.",
      optional: true,
    },
    currency: {
      type: "string",
      label: "Spend Limit Currency",
      description: "The type of currency, in [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217) format. Defaults to `USD` when omitted. Ignored when `Limit Type` is `USER`.",
      optional: true,
    },
    spendDuration: {
      propDefinition: [
        brexApp,
        "spendDuration",
      ],
      description: "How often the spend limit refreshes: `MONTHLY`, `QUARTERLY`, or `YEARLY` to refresh on that cadence, or `ONE_TIME` for a limit that never refreshes. Required when `Limit Type` is `CARD`; ignored when it is `USER`.",
      optional: true,
    },
    reason: {
      type: "string",
      label: "Spend Limit Reason",
      description: "A note explaining what the card is for, shown alongside the limit in Brex, e.g. `AWS monthly hosting`. Ignored when `Limit Type` is `USER`.",
      optional: true,
    },
    lockAfterDate: {
      type: "string",
      label: "Spend Limit Lock After Date",
      description: "The date the card stops accepting purchases, in `yyyy-mm-dd` format, e.g. `2026-12-31`. Omit for a card that never locks. Ignored when `Limit Type` is `USER`.",
      optional: true,
    },
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

    if (limitType === "CARD" && amount == null) {
      throw new ConfigurationError("Vendor cards (Limit Type `CARD`) carry their own spend limit. Set Spend Limit Amount, or set Limit Type to `USER` to draw on the cardholder's limit instead.");
    }

    if (limitType === "CARD" && !spendDuration) {
      throw new ConfigurationError("Vendor cards (Limit Type `CARD`) need a refresh cadence. Set Spend Duration, or set Limit Type to `USER` to draw on the cardholder's limit instead.");
    }

    const res = await axios($, this.brexApp._getAxiosParams({
      method: "POST",
      path: "/v2/cards",
      data: {
        owner: {
          type: "USER",
          user_id: user,
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

    $.export("$summary", `Card successfully created for user ${user}.`);
    return res;
  },
};
