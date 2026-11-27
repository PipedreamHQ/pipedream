import donethat from "../../donethat.app.mjs";
import constants from "../../common/constants.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "donethat-get-summary",
  name: "Get Summary",
  description: "Get the written summary DoneThat generated for a day, week, month, quarter or year (the same content as the in-app Summaries tab)."
    + " Use it to send a recap to email, Slack or Discord; use **Get Time Report** for raw time totals instead."
    + " Returns `content` plus `metadata.subject`, a suggested email subject line."
    + " Fails with a 404 when no summary exists yet for that date and level, for example today's before it has been generated."
    + " [See the documentation](https://donethat.ai/api-reference/messages)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    donethat,
    date: {
      type: "string",
      label: "Date",
      description: "A calendar date as `YYYY-MM-DD` in your DoneThat account's time zone, e.g. `2026-02-02`."
        + " For week, month, quarter and year summaries, any date inside that period. Defaults to yesterday.",
      optional: true,
    },
    level: {
      type: "string",
      label: "Level",
      description: "The period the summary covers. One of `day`, `week`, `month`, `quarter` or `year`, e.g. `day`.",
      options: constants.SUMMARY_LEVELS,
      default: "day",
      optional: true,
    },
    format: {
      propDefinition: [
        donethat,
        "summaryFormat",
      ],
    },
  },
  async run({ $ }) {
    if (this.date) {
      // Throws a ConfigurationError for a malformed or nonexistent date
      utils.dateToUtcStartMs(this.date, "Date");
    }

    const response = await this.donethat.getSummary({
      $,
      params: {
        date: this.date,
        level: this.level,
        format: this.format,
      },
    });

    $.export("$summary", `Retrieved ${response.level ?? this.level ?? "day"} summary for ${this.date ?? "yesterday"}`);
    return response;
  },
};
