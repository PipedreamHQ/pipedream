import { axios } from "@pipedream/platform";

// https://developer.yahoo.com/fantasysports/guide/#user-resource
export default {
  label: "Yahoo! Fantasy Sports",
  type: "app",
  app: "yahoo_fantasy_sports",
  propDefinitions: {
    league: {
      type: "string",
      label: "League",
      description: "Select a league",
      async options({ gameKey = "nfl" }) {
        return this.getLeagueOptions(gameKey);
      },
    },
  },
  methods: {
    async _makeRequest(config, $ = this) {
      if (!config.headers) config.headers = {};
      config.headers.Authorization = `Bearer ${this.$auth.oauth_access_token}`;
      if (config.path && !config.url) {
        const slashPrefixed = config.path[0] === "/"
          ? config.path
          : `/${config.path}`;
        config.url = `https://fantasysports.yahooapis.com/fantasy/v2${slashPrefixed}?format=json`;
        delete config.path;
      }
      return axios($, config);
    },
    unwrap(o) {
      if (o && typeof o === "object" && "count" in o) {
        const ret = [];
        for (let i = 0; i < o.count; i++) {
          // ignore the k as its the name of the object type
          for (const k in o[i]) {
            ret.push(this.unwrap(o[i][k]));
          }
        }
        return ret;
      }
      if (Array.isArray(o)) {
        // can be array and object mix...
        const ret = {};
        for (const el of o) {
          if (Array.isArray(el)) {
            for (const subel of el) {
              for (const k in subel) {
                ret[k] = this.unwrap(subel[k]);
              }
            }
          } else { // if object
            for (const k in el) {
              ret[k] = this.unwrap(el[k]);
            }
          }
        }
        return ret;
      }
      return o;
    },
    async getLeagueOptions(gameKey = "nfl") {
      const resp = await this._makeRequest({
        path: `/users;use_login=1/games;game_keys=${gameKey}/leagues/`,
      });
      const users = this.unwrap(resp.fantasy_content.users);
      const ret = [];
      if (users[0].games[0].leagues?.length > 0) {
        for (const league of users[0].games[0].leagues) {
          ret.push({
            value: league.league_key,
            label: league.name,
          });
        }
      }
      return ret;
    },
    async getLeagueTransactions(leagueKey, eventTypes) {
      const resp = await this._makeRequest({
        path: `/leagues;league_keys=${leagueKey}/transactions;types=${eventTypes.join(",")}`,
      });
      const leagues = this.unwrap(resp.fantasy_content.leagues);
      return leagues[0].transactions;
    },
    transactionSummary(txn) {
      switch (txn.type) {
      case "add": {
        const p = txn.players[0];
        return `Add: (+) ${this.displayPlayer(p)} -- ${p.transaction_data.destination_team_name}`;
      }
      case "add/drop": {
        // XXX check always add drop in this order
        const p0 = txn.players[0];
        const p1 = txn.players[1];
        return `Add/Drop: (+) ${this.displayPlayer(p0)} (-) ${this.displayPlayer(p1)} -- ${p0.transaction_data.destination_team_name}`;
      }
      case "drop": {
        const p = txn.players[0];
        return `Drop: (-) ${this.displayPlayer(p)} -- ${p.transaction_data.source_team_name}`;
      }
      case "commish":
        return "Commish event"; // XXX can't push much else :/
      case "trade": {
        // XXX join for team names...
        const a = txn.trader_team_key;
        const b = txn.tradee_team_key;
        const aps = [];
        const bps = [];
        for (const p of txn.players) {
          if (p.transaction_data.source_team_key === a) aps.push(p);
          if (p.transaction_data.source_team_key === b) bps.push(p);
        }
        return `Trade: ${aps.map(this.displayPlayer).join(" / ")} -- ${bps.map(this.displayPlayer).join(" / ")}`;
      }
      default:
        return "Unhandled transaction type";
      }
    },
    displayPlayer(p) {
      return `${p.name.full}, ${p.editorial_team_abbr} - ${p.display_position}`;
    },
  },
};
