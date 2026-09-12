import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "live_tennis_api",
  propDefinitions: {
    matchId: {
      type: "integer",
      label: "Match ID",
      description: "The match id, e.g. `184203` — the `id` field on each match returned by **Get Live Matches** or on each fixture from **Get Upcoming Fixtures**. Every match route shares one id space and ids are stable for the life of a match, so an id captured before a match starts still resolves after it finishes.",
      async options({ page }) {
        const limit = 20;
        const params = {
          limit,
          offset: limit * page,
        };
        const [
          live,
          upcoming,
        ] = await Promise.all([
          this.listMatches({
            params: {
              status: "live",
              ...params,
            },
          }),
          this.listMatches({
            params: {
              status: "upcoming",
              ...params,
            },
          }),
        ]);
        return [
          ...(live?.data ?? []),
          ...(upcoming?.data ?? []),
        ].map((match) => ({
          label: `${match.players?.p1?.name ?? "TBD"} vs ${match.players?.p2?.name ?? "TBD"} (${match.tournament ?? "Unknown"}, ${match.status})`,
          value: match.id,
        }));
      },
    },
    playerId: {
      type: "integer",
      label: "Player ID",
      description: "The player id, e.g. `12045` — the `id` field on each result from **Search Players**, also carried on match objects as `players.p1.id` / `players.p2.id`.",
      useQuery: true,
      async options({
        page, query,
      }) {
        const limit = 20;
        const { data = [] } = await this.searchPlayers({
          params: {
            search: query,
            limit,
            offset: limit * page,
          },
        });
        return data.map((player) => ({
          label: player.ranking
            ? `${player.name} (#${player.ranking})`
            : player.name,
          value: player.id,
        }));
      },
    },
    tour: {
      type: "string",
      label: "Tour",
      description: "Restrict results to one tour. Each value covers its singles and doubles draws, so `atp` includes ATP doubles and `juniors` covers the boys' and girls' Grand Slam draws. Omit for all tours.",
      optional: true,
      options: [
        "atp",
        "wta",
        "challenger",
        "itf",
        "juniors",
      ],
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of results to return.",
      optional: true,
      default: 50,
      min: 1,
      max: 200,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.livetennisapi.com/api/public/v1";
    },
    _makeRequest({
      $ = this, path, headers = {}, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          "Authorization": `Bearer ${this.$auth.api_key}`,
          "Accept": "application/json",
          ...headers,
        },
        ...opts,
      });
    },
    listMatches(args = {}) {
      return this._makeRequest({
        path: "/matches",
        ...args,
      });
    },
    listFixtures(args = {}) {
      return this._makeRequest({
        path: "/fixtures",
        ...args,
      });
    },
    searchPlayers(args = {}) {
      return this._makeRequest({
        path: "/players",
        ...args,
      });
    },
    getPlayer({
      playerId, ...args
    }) {
      return this._makeRequest({
        path: `/players/${playerId}`,
        ...args,
      });
    },
  },
};
