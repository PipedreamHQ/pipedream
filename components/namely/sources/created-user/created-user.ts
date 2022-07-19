import { defineSource } from "@pipedream/types";
import namely from "../../app/namely.app";

export default defineSource({
  key: "namely-created-user",
  version: "0.0.1",
  name: "New Created User",
  description: "Emit new event for each user created.",
  type: "source",
  props: {
    namely,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
  },
  dedupe: "unique",
  methods: {
    async emitEvent(user) {
      this.$emit(user, {
        id: user.id,
        summary: `New user created with id ${user.id}`,
        ts: Date.parse(user.created_at),
      });
    },
  },
  hooks: {
    async deploy() {
      const users = await this.namely.getUsers({
        perPage: 10,
      });

      for (const user of users) {
        this.emitEvent(user);
      }
    },
  },
  async run() {
    let page = 1;

    while (page > 0) {
      const users = await this.namely.getUsers({
        page,
      });

      if (!users || users.length <= 0) {
        page = -1;
      }

      for (const user of users) {
        this.emitEvent(user);
      }

      page++;
    }
  },
});
