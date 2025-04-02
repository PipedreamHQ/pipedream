import { axios } from "@pipedream/platform";
import lucca from "../../lucca.app.mjs";

export default {
  key: "lucca-new-user",
  name: "New User Created",
  description: "Emit new event when a new user (employee) is created in Lucca. [See the documentation](https://developers.lucca.fr/api-reference/legacy/directory/list-users)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    lucca,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 3600,
      },
    },
  },
  methods: {
    _getLastUserId() {
      return this.db.get("lastUserId") || 0;
    },
    _setLastUserId(id) {
      this.db.set("lastUserId", id);
    },
  },
  hooks: {
    async deploy() {
      const users = await this.lucca.listUsers();
      users.sort((a, b) => b.id - a.id);
      users.slice(0, 50).forEach((user) => {
        this.$emit(user, {
          id: user.id,
          summary: `New User: ${user.displayName}`,
          ts: new Date(user.modifiedOn).getTime(),
        });
      });
      if (users.length) {
        this._setLastUserId(users[0].id);
      }
    },
  },
  async run() {
    let lastUserId = this._getLastUserId();
    const users = await this.lucca.listUsers();

    users
      .filter((user) => user.id > lastUserId)
      .forEach((user) => {
        this.$emit(user, {
          id: user.id,
          summary: `New User: ${user.displayName}`,
          ts: new Date(user.modifiedOn).getTime(),
        });
      });

    if (users.length) {
      const newLastUserId = Math.max(...users.map((user) => user.id));
      this._setLastUserId(newLastUserId);
    }
  },
};
