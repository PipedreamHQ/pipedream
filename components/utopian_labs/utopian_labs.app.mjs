import { UtopianLabs } from "utopianlabs";

export default {
  type: "app",
  app: "utopian_labs",
  propDefinitions: {
    agent: {
      type: "string",
      label: "Agent",
      description: "The agent to run",
    },
    lead: {
      type: "object",
      label: "Lead",
      description: "The lead to research. [See the documentation](https://docs.utopianlabs.ai/types#the-lead-type) for more information. Example: `{ \"company\": { \"website\": \"https://pipedream.com/\" } }`",
    },
    minResearchSteps: {
      type: "integer",
      label: "Minimum Research Steps",
      description: "Optionally limit the agent to a minimum amount of research steps (default is 0)",
      optional: true,
    },
    maxResearchSteps: {
      type: "integer",
      label: "Maximum Research Steps",
      description: "Optionally limit the agent to a maximum amount of research steps (default is 5)",
      optional: true,
    },
    context: {
      type: "string",
      label: "Context",
      description: "The context for the run. This is a free-form string that will be used to guide the agent's research",
      optional: true,
    },
    additionalOptions: {
      type: "object",
      label: "Additional Options",
      description: "Additional parameters to send in the request. [See the documentation](https://docs.utopianlabs.ai/research#initiate-a-research-run) for all available parameters. Values will be parsed as JSON where applicable.",
      optional: true,
    },
  },
  methods: {
    _client() {
      return new UtopianLabs({
        apiKey: this.$auth.api_key,
      });
    },
    initiateRun(args) {
      return this._client().agents.runs.create(args);
    },
    getRunStatus(run) {
      return this._client().agents.runs.get({
        run,
      });
    },
  },
};
