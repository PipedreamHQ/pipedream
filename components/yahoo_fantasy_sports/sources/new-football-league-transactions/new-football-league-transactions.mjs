import yfs from "../../yahoo_fantasy_sports.app.mjs";
import options from "../common/options.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "yahoo_fantasy_sports-new-football-league-transactions",
  name: "New Football League Transactions",
  description: "Emit new event when a new football league transaction occurs",
  version: "0.0.4",
  type: "source",
  dedupe: "unique",
  props: {
    yfs,
    league: {
      propDefinition: [
        yfs,
        "league",
      ],
    },
    eventTypes: {
      type: "string[]",
      label: "Event Types",
      description: "Select the types of events to watch for",
      options: options.EVENT_TYPES,
      optional: true,
      default: [
        "*",
      ],
    },
    timer: {
      label: "Polling interval",
      description: "Pipedream will poll the API on this schedule",
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  async run() {
    const eventTypes = this.eventTypes.includes("*")
      ? options.ALL_EVENT_TYPES
      : this.eventTypes;

    const transactions = await this.yfs.getLeagueTransactions(this.league, eventTypes);
    if (Object.keys(transactions).length === 0) {
      return;
    }

    for (const txn of transactions) {
      txn._summary = this.yfs.transactionSummary(txn);
      this.$emit(txn, {
        id: txn.transaction_key,
        ts: (+txn.timestamp) * 1000,
        summary: txn._summary,
      });
    }
  },
};
