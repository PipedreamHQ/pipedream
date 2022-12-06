import common from "../common/common-polling.mjs";

export default {
  ...common,
  key: "monday-new-user",
  name: "New User",
  description: "Emit new event when a new user is created in Monday.",
  type: "source",
  version: "0.0.2",
  dedupe: "unique",
  methods: {
    ...common.methods,
    generateMeta(user) {
      return {
        id: user.id,
        summary: user.name,
        ts: Date.parse(user.created_at),
      };
    },
  },
  async run() {
    const lastId = this._getLastId();
    let maxId = lastId;

    const users = await this.monday.listUsers();
    for (const user of users) {
      if (+user.id <= lastId) {
        break;
      }
      if (+user.id > maxId) {
        maxId = +user.id;
      }
      const userData = await this.monday.getUser({
        id: +user.id,
      });
      this.emitEvent(userData);
    }

    this._setLastId(maxId);
  },
};
