import common from "../common/base.mjs";

export default {
  ...common,
  key: "zep-new-session",
  name: "New Session Created",
  description: "Emit new event when a new session is created in Zep. [See the documentation](https://help.getzep.com/api-reference/memory/list-sessions)",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getNewResults(lastTs, max) {
      return this.getSessions({
        lastTs,
        max,
        orderBy: "created_at",
      });
    },
    generateMeta(session) {
      return {
        id: session.session_id,
        summary: `New Session: ${session.session_id}`,
        ts: Date.parse(session.created_at),
      };
    },
  },
};
