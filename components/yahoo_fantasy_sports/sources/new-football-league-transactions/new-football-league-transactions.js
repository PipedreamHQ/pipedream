const yfs = require('../../yahoo_fantasy_sports.app.js')

function displayPlayer(p) {
  return `${p.name.full}, ${p.editorial_team_abbr} - ${p.display_position}`
}

module.exports = {
  key: "yahoo_fantasy_sports-new-football-league-transactions",
  name: "New Football League Transactions",
  version: "0.0.1",
  props: {
    yfs,
    league: {
      type: "string",
      async options() {
        return await this.yfs.getLeagueOptions()
      },
    },
    eventTypes: {
      type: "string[]",
      options: ["*", "add", "drop", "commish", "trade"], // not type with team_key
      optional: true,
      default: ["*"],
    },
    timer: "$.interface.timer",
  },
  dedupe: "unique",
  async run() {
    let eventTypes = []
    if (this.eventTypes.includes("*")) {
      eventTypes.push("add", "drop", "commish", "trade")
    } else {
      eventTypes = this.eventTypes
    }
    const transactions = await this.yfs.getLeagueTransactions(this.league, eventTypes)
    // XXX figure out count... field any integer greater than 0 but nothing about default limit or pagination?
    for (const txn of transactions) {
      txn._summary = this.yfs.transactionSummary(txn)
      this.$emit(txn, {
        id: txn.transaction_key,
        ts: (+txn.timestamp)*1000,
        summary: txn._summary,
      })
    }
  },
}
