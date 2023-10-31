import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import lightspeed_vt from "../../lightspeed_vt.app.mjs";

export default {
  key: "lightspeed_vt-new-user-added",
  name: "New User Added",
  description: "Emits a new event every time there is a new user in the system",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    lightspeed_vt,
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
    const users = await this.lightspeed_vt.listUsers();
    users.sort((a, b) => a.userId - b.userId);  // sort by userId in ascending order
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
