import oanda from "../../oanda.app.mjs";
import constants from "../../common/constants.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "oanda-get-historical-prices",
  name: "Get Historical Prices",
  description: "Retrieve historical price data for a specified currency pair or instrument within a given time range. [See the documentation](https://developer.oanda.com/rest-live-v20/pricing-ep/)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    oanda,
    isDemo: {
      propDefinition: [
        oanda,
        "isDemo",
      ],
    },
    accountId: {
      propDefinition: [
        oanda,
        "accountId",
        (c) => ({
          isDemo: c.isDemo,
        }),
      ],
    },
    instrument: {
      propDefinition: [
        oanda,
        "instrument",
      ],
    },
    startTime: {
      type: "string",
      label: "Start Time",
      description: "The start time for historical price data (ISO 8601 format). E.g. `2025-04-01T04:00:00.000000000Z`",
    },
    endTime: {
      type: "string",
      label: "End Time",
      description: "The end time for historical price data (ISO 8601 format). E.g. `2025-04-01T04:00:00.000000000Z`",
    },
    price: {
      type: "string",
      label: "Price",
      description: "The Price component(s) to get candlestick data for. Can contain any combination of the characters “M” (midpoint candles) “B” (bid candles) and “A” (ask candles).",
      optional: true,
    },
    granularity: {
      type: "string",
      label: "Granularity",
      description: "The granularity of the candlesticks to fetch",
      options: constants.CANDLE_GRANULARITIES,
      optional: true,
    },
    smooth: {
      type: "boolean",
      label: "Smooth",
      description: "A flag that controls whether the candlestick is “smoothed” or not. A smoothed candlestick uses the previous candle’s close price as its open price, while an unsmoothed candlestick uses the first price from its time range as its open price.",
      optional: true,
    },
    includeFirst: {
      type: "boolean",
      label: "Include First",
      description: "A flag that controls whether the candlestick that is covered by the from time should be included in the results. This flag enables clients to use the timestamp of the last completed candlestick received to poll for future candlesticks but avoid receiving the previous candlestick repeatedly.",
      optional: true,
    },
    dailyAlignment: {
      type: "integer",
      label: "Daily Alignment",
      description: "The hour of the day (in the specified timezone) to use for granularities that have daily alignments. minimum=0, maximum=23",
      optional: true,
    },
    alignmentTimezone: {
      type: "string",
      label: "Alignment Timezone",
      description: "The timezone to use for the dailyAlignment parameter. Candlesticks with daily alignment will be aligned to the dailyAlignment hour within the alignmentTimezone. Note that the returned times will still be represented in UTC. [default=America/New_York]",
      optional: true,
    },
    weeklyAlignment: {
      type: "string",
      label: "Weekly Alignment",
      description: "The day of the week used for granularities that have weekly alignment. [default=Friday]",
      options: constants.WEEKLY_ALIGNMENT_DAYS,
      optional: true,
    },
    units: {
      type: "integer",
      label: "Units",
      description: "The number of units used to calculate the volume-weighted average bid and ask prices in the returned candles. [default=1]",
      optional: true,
    },
  },
  async run({ $ }) {
    try {
      const response = await this.oanda.getHistoricalPrices({
        $,
        isDemo: this.isDemo,
        accountId: this.accountId,
        instrument: this.instrument,
        params: {
          price: this.price,
          granularity: this.granularity,
          from: this.startTime,
          to: this.endTime,
          smooth: this.smooth,
          includeFirst: this.includeFirst,
          dailyAlignment: this.dailyAlignment,
          alignmentTimezone: this.alignmentTimezone,
          weeklyAlignment: this.weeklyAlignment,
          units: this.units,
        },
      });
      $.export("$summary", `Successfully retrieved ${response.candles.length} trade${response.candles.length === 1
        ? ""
        : "s"}`);
      return response;
    } catch (error) {
      if (error?.message.includes("Maximum value for 'count' exceeded")) {
        throw new ConfigurationError("Maximum results exceeded. Update the time range or granularity to return fewer results.");
      } else {
        console.error("Error retrieving historical prices:", error);
        throw error;
      }
    }
  },
};
