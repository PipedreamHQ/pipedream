// x-pd-ai: optimized
import bonusly from "../../bonusly.app.mjs";

export default {
  key: "bonusly-give-bonus",
  name: "Give Bonus",
  description: "Send recognition (a bonus) to one or more colleagues on behalf of the authenticated caller. Do not include `@mentions` or the point amount in the `reason` yourself - Bonusly synthesizes those from `recipients` and `amount` automatically. [See the documentation](https://docs.bonus.ly/reference/giverecognition-1)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    bonusly,
    recipients: {
      type: "string[]",
      label: "Recipients",
      description: "One or more recipients - each entry can be a user ID, an email address, or a display name, e.g. `john.smith@company.com`. Use **Search Users** to look up one person by name, or **List Users In Department**, **List Users In Location**, or **List Top-Level Users** to recognize a whole roster at once.",
    },
    amount: {
      type: "integer",
      label: "Amount",
      description: "Points to give. Pass `0` only if your company allows zero-point recognition.",
      min: 0,
    },
    reason: {
      type: "string",
      label: "Reason",
      description: "Free-form recognition message explaining why you're giving this bonus, e.g. `Great work on the product launch!`.",
    },
    hashtag: {
      type: "string",
      label: "Hashtag",
      description: "One company hashtag, without the leading `#`, e.g. `teamwork`. Some Bonusly companies require a hashtag on every recognition - if the tool rejects the request for a missing hashtag, set one here.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.bonusly.giveRecognition({
      $,
      recipients: this.recipients,
      amount: this.amount,
      reason: this.reason,
      hashtag: this.hashtag,
    });

    const names = response.recipients?.map(({ name }) => name).join(", ");
    const bonusId = response.bonus_id
      ? ` (bonus ID: ${response.bonus_id})`
      : "";
    $.export("$summary", `Gave ${this.amount} points to ${names || "recipient(s)"}${bonusId}`);
    return response;
  },
};
