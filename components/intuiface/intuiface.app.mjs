import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "intuiface",
  propDefinitions: {
    experienceNames: {
      type: "string[]",
      label: "Experience Names",
      description: "Specify experience(s) based on their name(s).",
      optional: true,
      async options() {
        const result = await this.availableExperiences({
          $: this,
        });
        return result.experiences.map((experience) => experience.name);
      },
    },
    experienceIDs: {
      type: "string[]",
      label: "Experience IDs",
      description: "Specify experience(s) based on their ID(s).",
      optional: true,
      async options() {
        const result = await this.availableExperiences({
          $: this,
        });
        return result.experiences.map((experience) => ({
          label: experience.name,
          value: experience.id,
        }));
      },
    },
    playerDeviceNames: {
      type: "string[]",
      label: "Player Device Names",
      description: "Specify player(s) based on their device name(s).",
      optional: true,
      async options() {
        const result = await this.availableExperiences({
          $: this,
        });
        return result.experiences.map((experience) => experience.RunningOnPlayer.nickName);
      },
    },
    playerIds: {
      type: "string[]",
      label: "Player IDs",
      description: "Specify player(s) based on their device ID(s). ",
      optional: true,
      async options() {
        const result = await this.availableExperiences({
          $: this,
        });
        return result.experiences.map((experience) => ({
          label: experience.RunningOnPlayer.nickName,
          value: experience.RunningOnPlayer.playerId,
        }));
      },
    },
  },
  methods: {
    _getBaseURL() {
      return "https://api.intuiface.com/webtriggers/v1";
    },
    _getHeaders() {
      return {
        "x-api-key": this.$auth.api_key,
        "Content-Type": "application/json",
      };
    },
    async makeRequest(endpoint, opts = {}) {
      const {
        method = "GET",
        params,
        data,
        $,
      } = opts;
      const config = {
        method,
        url: `${this._getBaseURL()}${endpoint}`,
        headers: this._getHeaders(),
        params,
        data,
      };
      return axios($ ?? this, config);
    },
    sendMessage({
      $,
      params,
    }) {
      return this.makeRequest(
        "/sendMessage",
        {
          params,
          $,
        },
      );
    },
    availableExperiences({
      $ = this,
      params,
    }) {
      return this.makeRequest(
        "/availableExperiences",
        {
          params,
          $,
        },
      );
    },
  },
};
