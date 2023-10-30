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
    _setLastUserId(id) {
      this.db.set("lastUserId", id);
    },
  },
  async run() {
    const lastUserId = this._getLastUserId();
    const { data: users } = await this.lightspeed_vt._makeRequest({
      path: "/users",
    });

    // Ensure users are sorted by ID in ascending order
    users.sort((a, b) => a.id - b.id);

    users.forEach((user) => {
      if (user.id > lastUserId) {
        this.$emit(user, {
          id: user.id,
          summary: `New user: ${user.username}`,
          ts: Date.now(),
        });
        this._setLastUserId(user.id);
      }
    });
  },
};
