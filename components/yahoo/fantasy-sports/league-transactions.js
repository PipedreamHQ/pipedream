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
      // XXX make this less cryptic :P
      const ret = []
      for (let i = 0; i < o.count; i++) {
        const arr = o[i]
        for (const k in arr) {
          const sub = arr[k][0]
          if (arr[k][1]) {
            for (const subk in arr[k][1]) {
              const subo = this.unwrap(arr[k][1][subk])
              sub[subk] = subo
            }
          }
          ret.push(sub)
        }
      }
      return ret
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
