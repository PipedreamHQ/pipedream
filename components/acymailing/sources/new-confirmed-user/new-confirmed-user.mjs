import acymailing from "../../acymailing.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "acymailing-new-confirmed-user",
  name: "New Confirmed User",
  description: "Emits an event when a user confirms their email address.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    acymailing,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
  },
  hooks: {
    async deploy() {
      // Fetch users during deployment to avoid emitting events for all existing users
      await this.fetchAndEmitUsers();
    },
  },
  methods: {
    ...acymailing.methods,
    async fetchAndEmitUsers() {
      const lastConfirmationDate = this.db.get("lastConfirmationDate") || null;
      let offset = 0;
      let hasMore = true;

      while (hasMore) {
        const {
          users, nextOffset,
        } = await this.acymailing.getUsers({
          lastConfirmationDate,
          offset,
        });

        users.forEach((user) => {
          const meta = this.generateMeta(user);
          this.$emit(user, meta);
        });

        hasMore = users.length > 0 && nextOffset !== undefined;
        offset = nextOffset;

        if (users.length > 0) {
          const mostRecentConfirmationDate = users
            .map((user) => user.confirmation_date)
            .sort()
            .reverse()[0];
          this.db.set("lastConfirmationDate", mostRecentConfirmationDate);
        }
      }
    },
    generateMeta(data) {
      const {
        id, email, confirmation_date,
      } = data;
      return {
        id: id.toString(),
        summary: `User ${email} confirmed at ${confirmation_date}`,
        ts: Date.parse(confirmation_date),
      };
    },
  },
  async run() {
    await this.fetchAndEmitUsers();
  },
};
