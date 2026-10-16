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
    teamKey: {
      type: "string",
      label: "Team Key",
      description: "The team key, e.g. `414.l.12345.t.1`. Use **Get League Standings** to find the team key in the `team_key` field",
    },
    week: {
      type: "string",
      label: "Week",
      description: "Week number, e.g. `5` (defaults to the current week)",
      optional: true,
    },
    position: {
      type: "string",
      label: "Position",
      description: "Filter by position, e.g. `QB`, `RB`, `WR`. Leave blank for all positions",
      optional: true,
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
          for (const k in o[i]) {
            ret.push(this.unwrap(o[i][k]));
          }
        }
        return ret;
      }
      if (Array.isArray(o)) {
        const ret = {};
        for (const el of o) {
          if (Array.isArray(el)) {
            for (const subel of el) {
              for (const k in subel) {
                ret[k] = this.unwrap(subel[k]);
              }
            }
          } else {
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
    async getLeagues(gameKey = "nfl", season, $ = this) {
      const key = season || gameKey;
      const resp = await this._makeRequest({
        path: `/users;use_login=1/games;game_keys=${key}/leagues/`,
      }, $);
      const users = this.unwrap(resp.fantasy_content.users);
      return users[0]?.games?.[0]?.leagues ?? [];
    },
    async getLeagueStandings(leagueKey, $ = this) {
      const resp = await this._makeRequest({
        path: `/league/${leagueKey}/standings`,
      }, $);
      const league = this.unwrap(resp.fantasy_content.league);
      const leagueObj = Array.isArray(league)
        ? league[0]
        : league;
      const standings = leagueObj?.standings;
      const standingsObj = Array.isArray(standings)
        ? standings[0]
        : standings;
      return standingsObj?.teams ?? [];
    },
    async getLeagueSettings(leagueKey, $ = this) {
      const resp = await this._makeRequest({
        path: `/league/${leagueKey}/settings`,
      }, $);
      const league = this.unwrap(resp.fantasy_content.league);
      const leagueObj = Array.isArray(league)
        ? league[0]
        : league;
      const settings = leagueObj?.settings;
      return (Array.isArray(settings)
        ? settings[0]
        : settings) ?? {};
    },
    async getTeamRoster(teamKey, week, $ = this) {
      const weekParam = week
        ? `;week=${week}`
        : "";
      const resp = await this._makeRequest({
        path: `/team/${teamKey}/roster${weekParam}`,
      }, $);
      const team = this.unwrap(resp.fantasy_content.team);
      const teamObj = Array.isArray(team)
        ? team[0]
        : team;
      const roster = teamObj?.roster;
      const rosterObj = Array.isArray(roster)
        ? roster[0]
        : roster;
      return rosterObj?.players ?? [];
    },
    async getTeamMatchups(teamKey, week, $ = this) {
      const weeksParam = week
        ? `;weeks=${week}`
        : "";
      const resp = await this._makeRequest({
        path: `/team/${teamKey}/matchups${weeksParam}`,
      }, $);
      const team = this.unwrap(resp.fantasy_content.team);
      const teamObj = Array.isArray(team)
        ? team[0]
        : team;
      return teamObj?.matchups ?? [];
    },
    async getPlayerStats(leagueKey, position, start, $ = this) {
      const positionParam = position
        ? `;position=${position}`
        : "";
      const startParam = start
        ? `;start=${start}`
        : "";
      const resp = await this._makeRequest({
        path: `/league/${leagueKey}/players${positionParam}${startParam}/stats;type=season`,
      }, $);
      const league = this.unwrap(resp.fantasy_content.league);
      const leagueObj = Array.isArray(league)
        ? league[0]
        : league;
      return leagueObj?.players ?? [];
    },
    async getFreeAgents(leagueKey, { position, sort, count, start } = {}, $ = this) {
      let path = `/league/${leagueKey}/players;status=FA`;
      if (position) path += `;position=${position}`;
      if (sort) path += `;sort=${sort}`;
      if (count) path += `;count=${count}`;
      if (start) path += `;start=${start}`;
      const resp = await this._makeRequest({
        path,
      }, $);
      const league = this.unwrap(resp.fantasy_content.league);
      const leagueObj = Array.isArray(league)
        ? league[0]
        : league;
      return leagueObj?.players ?? [];
    },
    async getLeagueTransactions(leagueKey, eventTypes, $ = this) {
      const resp = await this._makeRequest({
        path: `/leagues;league_keys=${leagueKey}/transactions;types=${eventTypes.join(",")}`,
      }, $);
      const leagues = this.unwrap(resp.fantasy_content.leagues);
      return leagues[0]?.transactions ?? [];
    },
    transactionSummary(txn) {
      switch (txn.type) {
      case "add": {
        const p = txn.players[0];
        return `Add: (+) ${this.displayPlayer(p)} -- ${p.transaction_data.destination_team_name}`;
      }
      case "add/drop": {
        const p0 = txn.players[0];
        const p1 = txn.players[1];
        return `Add/Drop: (+) ${this.displayPlayer(p0)} (-) ${this.displayPlayer(p1)} -- ${p0.transaction_data.destination_team_name}`;
      }
      case "drop": {
        const p = txn.players[0];
        return `Drop: (-) ${this.displayPlayer(p)} -- ${p.transaction_data.source_team_name}`;
      }
      case "commish":
        return "Commish event";
      case "trade": {
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
