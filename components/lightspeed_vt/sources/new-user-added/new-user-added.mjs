import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import lightspeedVt from "../../lightspeed_vt.app.mjs";

export default {
  key: "lightspeed_vt-new-user-added",
  name: "New User Added",
  description: "Emit new event every time there is a new user in the system",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    lightspeedVt,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getLastUserId() {
      return this.db.get("lastUserId") || 0;
    },
    _setLastUserId(userId) {
      this.db.set("lastUserId", userId);
    },
  },
  async run() {
    const users = await this.lightspeedVt.listUsers();
    users.sort((a, b) => a.userId - b.userId);
    const lastUserId = this._getLastUserId();

    for (const user of users) {
      if (user.userId > lastUserId) {
        this.$emit(user, {
          id: user.userId,
          summary: `New user: ${user.username}`,
          ts: Date.now(),
        });
        this._setLastUserId(user.userId);
      }
    }
  },
};
