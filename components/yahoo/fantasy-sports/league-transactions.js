const axios = require("axios")

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
    async getLeagueTransactions(leagueKey) {
      const resp = await this._makeRequest({
        path: `/leagues;league_keys=${leagueKey}/transactions`,
      })
      const leagues = this.unwrap(resp.data.fantasy_content.leagues)
      return leagues[0].transactions
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
    timer: "$.interface.timer",
  },
  dedupe: "unique",
  async run() {
    const transactions = await this.yfs.getLeagueTransactions(this.league)
    // XXX figure out count
    // XXX make calls to join with metadata
    for (const transaction of transactions) {
      this.$emit(transaction, {
        id: transaction.transaction_key,
        ts: (+transaction.timestamp)*1000,
      })
    }
  },
}
