import { axios } from "@pipedream/platform";
import connecteam from "../../connecteam.app.mjs";

export default {
  key: "connecteam-new-user",
  name: "New User Added",
  description: "Emit new event when a new user is added. [See the documentation](https://developer.connecteam.com/reference/get_users_users_v1_users_get)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    connecteam,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
  },
  hooks: {
    async deploy() {
      const users = await this.connecteam.getUsers();
      for (const user of users.slice(-50)) {
        this.$emit(user, {
          id: user.userId,
          summary: `New User: ${user.firstName} ${user.lastName}`,
          ts: user.createdAt,
        });
      }
    },
  },
  methods: {
    async emitNewUsers() {
      const users = await this.connecteam.getUsers();
      const lastTimestamp = this.db.get("lastTimestamp") || 0;

      for (const user of users) {
        if (user.createdAt > lastTimestamp) {
          this.$emit(user, {
            id: user.userId,
            summary: `New User: ${user.firstName} ${user.lastName}`,
            ts: user.createdAt,
          });
        }
      }

      const latestUser = users.reduce((latest, user) => user.createdAt > latest
        ? user.createdAt
        : latest, lastTimestamp);
      this.db.set("lastTimestamp", latestUser);
    },
  },
  async run() {
    await this.emitNewUsers();
  },
};
