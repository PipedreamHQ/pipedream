import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "amazon_alexa",
  propDefinitions: {
    skillId: {
      type: "string",
      label: "Skill ID",
      description: "The unique identifier for the Alexa skill",
    },
    stage: {
      type: "string",
      label: "Stage",
      description: "The stage of the skill, such as development or live",
      options: [
        {
          label: "Development",
          value: "development",
        },
        {
          label: "Live",
          value: "live",
        },
      ],
    },
    intent: {
      type: "string",
      label: "Intent",
      description: "The intent to invoke for testing the skill",
    },
    simulationId: {
      type: "string",
      label: "Simulation ID",
      description: "The identifier for the simulation",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.amazonalexa.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
          "Content-Type": "application/json",
        },
      });
    },
    async invokeSkill({
      skillId, stage, intent,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/v1/skills/${skillId}/stages/${stage}/invocations`,
        data: {
          intentRequest: {
            intent,
          },
        },
      });
    },
    async simulateSkill({
      skillId, stage, intent,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/v1/skills/${skillId}/stages/${stage}/simulations`,
        data: {
          input: {
            content: intent,
          },
          device: {
            locale: "en-US",
          },
          session: {
            mode: "FORCE_NEW_SESSION",
          },
        },
      });
    },
    async getSimulation({
      skillId, stage, simulationId,
    }) {
      return this._makeRequest({
        path: `/v1/skills/${skillId}/stages/${stage}/simulations/${simulationId}`,
      });
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
  version: `0.0.${new Date().getTime()}`,
};
