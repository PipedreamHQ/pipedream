import common from "../common/common-polling.mjs";

export default {
  ...common,
  key: "monday-new-user",
  name: "New User Created",
  description: "Emit new event when a new user is created in Monday. [See the documentation](https://developer.monday.com/api-reference/reference/webhooks#sample-payload-for-webhook-events)",
  type: "source",
  version: "0.0.11",
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
