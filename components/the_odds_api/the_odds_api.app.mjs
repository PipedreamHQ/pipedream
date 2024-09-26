import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "the_odds_api",
  propDefinitions: {
    sport: {
      type: "string",
      label: "Sport",
      description: "The sport from which the odds will be returned",
      async options() {
        const sports = await this.getSports();

        return sports.map(({
          key, title, description,
        }) => ({
          label: `${title} (${description})`,
          value: key,
        }));
      },
    },
    event: {
      type: "string",
      label: "Event",
      description: "The sport from which the odds will be returned",
      async options({
        region, sport,
      }) {
        const events = await this.getUpcomingEvents({
          sport,
          params: {
            regions: region,
          },
        });

        return events.map(({
          id, home_team, away_team,
        }) => ({
          label: `${home_team} x ${away_team}`,
          value: id,
        }));
      },
    },
  },
  methods: {
    _apiKey() {
      return this.$auth.api_key;
    },
    _apiUrl() {
      return "https://api.the-odds-api.com/v4";
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        ...args,
        params: {
          ...args.params,
          apiKey: this._apiKey(),
        },
      });
    },
    async fetchCurrentOdds({
      sport, event, ...args
    }) {
      return this._makeRequest({
        path: `/sports/${sport}/events/${event}/odds`,
        ...args,
      });
    },
    async getSports(args = {}) {
      return this._makeRequest({
        path: "/sports",
        ...args,
      });
    },
    async getUpcomingEvents({
      sport, ...args
    }) {
      return this._makeRequest({
        path: `/sports/${sport}/odds`,
        ...args,
      });
    },
  },
};
