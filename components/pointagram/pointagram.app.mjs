import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "pointagram",
  propDefinitions: {
    name: {
      type: "string",
      label: "Name",
      description: "The name of the player in Pointagram",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the player. Used for sending invitation",
    },
    externalId: {
      type: "string",
      label: "External ID",
      description: "Optional id you can provide as an unique identifier for the player.",
      optional: true,
    },
    offline: {
      type: "boolean",
      label: "Offline",
      description: "Set `true` for offline or `false` for online player. An online player will receive an invitation to log on to Pointagram. Note, you can create players as offline players and convert them later in Pointagram.",
      optional: true,
    },
    playerId: {
      type: "string",
      label: "Player ID",
      description: "The ID of the player in Pointagram",
      async options() {
        const players = await this.listPlayers();
        return players.map((player) => ({
          label: player.Name,
          value: player.id,
        }));
      },
    },
    scoreSeriesId: {
      type: "string",
      label: "Score Series ID",
      description: "The ID of the score series in Pointagram",
      async options() {
        const scoreSeries = await this.listScoreSeries();
        return scoreSeries.map((scoreSeries) => ({
          label: scoreSeries.name,
          value: scoreSeries.id,
        }));
      },
    },
  },
  methods: {
    _getAxiosParams(opts) {
      const params =  {
        ...opts,
        url: this._getBaseUrl() + opts.path,
        headers: this._getHeaders(),
      };
      return params;
    },
    _getBaseUrl() {
      return "https://app.pointagram.com/server";
    },
    _getHeaders() {
      return {
        "content-type": "application/json",
        "api_key": this.$auth.api_key,
        "api_user": this.$auth.api_user,
      };
    },
    async createPlayer(data, $ = this) {
      const opts = {
        path: "/externalapi.php/create_player",
        method: "POST",
        data,
      };
      return axios($, this._getAxiosParams(opts));
    },
    async listPlayers($ = this) {
      const opts = {
        path: "/externalapi.php/list_players",
        method: "GET",
      };
      return axios($, this._getAxiosParams(opts));
    },
    async addPointsToPlayer(data, $ = this) {
      const opts = {
        path: "/externalapi.php/add_score",
        method: "POST",
        data,
      };
      return axios($, this._getAxiosParams(opts));
    },
    async listScoreSeries($ = this) {
      const opts = {
        path: "/externalapi.php/list_score_series",
        method: "GET",
      };
      return axios($, this._getAxiosParams(opts));
    },
  },
};
