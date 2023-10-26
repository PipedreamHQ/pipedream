import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import lightspeed_vt from "../../lightspeed_vt.app.mjs";

export default {
  key: "lightspeed_vt-new-user-added",
  name: "New User Added",
  description: "Emits a new event every time there is a new user in the system, and returns the detail of the new user who has been added.",
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
    _getPrevUsers() {
      return this.db.get("prevUsers") ?? [];
    },
    _setPrevUsers(users) {
      this.db.set("prevUsers", users);
    },
  },
  async run() {
    const prevUsers = this._getPrevUsers();
    const users = await this.lightspeed_vt._makeRequest({
      path: "/users",
    });

    for (const user of users) {
      if (!prevUsers.includes(user.userName)) {
        this.$emit(user, {
          id: user.id,
          summary: `New User: ${user.firstName} ${user.lastName}`,
          ts: Date.now(),
        });
        prevUsers.push(user.userName);
      }
    }

    this._setPrevUsers(prevUsers);
  },
};
