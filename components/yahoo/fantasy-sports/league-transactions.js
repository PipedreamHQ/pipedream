const axios = require("axios")

// https://developer.yahoo.com/fantasysports/guide/#user-resource
const yfs = {
  label: "Yahoo! Fantasy Sports",
  type: "app",
  app: "yahoo_fantasy_sports",
  methods: {
    async _makeRequest(config) {
      if (!config.headers) config.headers = {}
      config.headers.Authorization = `Bearer ${this.$auth.oauth_access_token}`
      if (config.path && !config.url) {
        const slashPrefixed = config.path[0] === "/" ? config.path : `/${config.path}`
        config.url = `https://fantasysports.yahooapis.com/fantasy/v2${slashPrefixed}?format=json`
        delete config.path
      }
      return await axios(config)
    },
    unwrap(o) {
      if (o && typeof o === "object" && "count" in o) {
        const ret = []
        for (let i = 0; i < o.count; i++) {
          // ignore the k as its the name of the object type
          for (const k in o[i]) {
            ret.push(this.unwrap(o[i][k]))
          }
        }
        return ret
      }
      if (Array.isArray(o)) {
        // can be array and object mix...
        const ret = {}
        for (const el of o) {
          if (Array.isArray(el)) {
            for (const subel of el) {
              for (const k in subel) {
                ret[k] = this.unwrap(subel[k])
              }
            }
          } else { // if object
            for (const k in el) {
              ret[k] = this.unwrap(el[k])
            }
          }
        }
        return ret
      }
      return o
    },
    async getLeagueOptions() {
      const resp = await this._makeRequest({
        path: "/users;use_login=1/games;game_keys=nfl/leagues/",
      })
      const users = this.unwrap(resp.data.fantasy_content.users)
      const ret = []
      for (const league of users[0].games[0].leagues) {
        ret.push({
          value: league.league_key,
          label: league.name,
        })
      }
      return ret
    },
    async getLeagueTransactions(leagueKey, eventTypes) {
      const resp = await this._makeRequest({
        path: `/leagues;league_keys=${leagueKey}/transactions;types=${eventTypes.join(",")}`,
      })
      const leagues = this.unwrap(resp.data.fantasy_content.leagues)
      return leagues[0].transactions
    },
    transactionSummary(txn) {
      switch (txn.type) {
        case "add": {
          const p = txn.players[0]
          return `(+) ${p.name.full}, ${p.editorial_team_abbr} - ${p.display_position} -- ${p.transaction_data.destination_team_name}`
        }
        case "add/drop": {
          // XXX check always add drop in this order
          const p0 = txn.players[0]
          const p1 = txn.players[1]
          return `(+) ${p0.name.full}, ${p0.editorial_team_abbr} - ${p0.display_position} ` +
          `(-) ${p1.name.full}, ${p1.editorial_team_abbr} - ${p1.display_position} -- ${p0.transaction_data.destination_team_name}`
        }
        case "drop": {
          const p = txn.players[0]
          return `(-) ${p.name.full}, ${p.editorial_team_abbr} - ${p.display_position} -- ${p.transaction_data.source_team_name}`
        }
        case "commish":
          return "Commish event" // XXX can't push much else :/
        // TODO
        // case "trade":
        //   break
        default:
          return "Unhandled transaction type"
      }
    },
  },
}

module.exports = {
  name: "Yahoo! Fantasy Sports: Football - League Transactions",
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
