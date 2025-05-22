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
