import common from "../common/polling.mjs";

export default {
  ...common,
  key: "sessions-new-session-ended",
  name: "New Session Ended",
  description: "Emit new event when a session ends. Useful for data processing initiation. [See the documentation](https://api.app.sessions.us/api-docs/#/default/get_api_sessions)",
  version: "0.0.1",
  type: "source",
  methods: {
    ...common.methods,
    emitEvent(data) {
      this._setLastResourceId(data.id);

      this.$emit(data, {
        id: data.id,
        summary: `New session ended with id ${data.id}`,
        ts: Date.parse(data.startAt),
      });
    },
    async getResources(args = {}) {
      return this.sessions.getSessions(args);
    },
    filterResources(resources) {
      return resources.filter((resource) => !!resource.endedAt);
    },
  },
};
