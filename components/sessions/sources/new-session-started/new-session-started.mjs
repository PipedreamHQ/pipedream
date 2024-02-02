import common from "../common/polling.mjs";

export default {
  ...common,
  key: "sessions-new-session-started",
  name: "New Session Started",
  description: "Emit new an event when a session starts. [See the documentation](https://api.app.sessions.us/api-docs/#/default/get_api_sessions)",
  version: "0.0.1",
  type: "source",
  methods: {
    ...common.methods,
    emitEvent(data) {
      this._setLastResourceId(data.id);

      this.$emit(data, {
        id: data.id,
        summary: `New session started with id ${data.id}`,
        ts: Date.parse(data.startAt),
      });
    },
    async getResources(args = {}) {
      return this.sessions.getSessions(args);
    },
    filterResources(resources) {
      return resources.filter((resource) => !resource.endedAt);
    },
  },
};
