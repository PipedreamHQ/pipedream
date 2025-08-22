import common from "../common/base.mjs";

export default {
  ...common,
  key: "zep-session-updated",
  name: "New Session Updated",
  description: "Emit new event when an existing session is updated. [See the documentation](https://help.getzep.com/api-reference/memory/list-sessions)",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getNewResults(lastTs, max) {
      return this.getSessions({
        lastTs,
        max,
        orderBy: "updated_at",
      });
    },
    generateMeta(session) {
      const ts = Date.parse(session.updated_at);
      return {
        id: `${session.session_id}${ts}`,
        summary: `Updated Session: ${session.session_id}`,
        ts,
      };
    },
  },
};
