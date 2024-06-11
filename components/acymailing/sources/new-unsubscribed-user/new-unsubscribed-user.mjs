import acymailing from "../../acymailing.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "acymailing-new-unsubscribed-user",
  name: "New Unsubscribed User",
  description: "Emits an event when a user unsubscribes from the specified mailing list(s). [See the documentation](https://www.acymailing.com/documentation/)",
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
    lists: {
      propDefinition: [
        acymailing,
        "lists",
      ],
    },
  },
  methods: {
    ...acymailing.methods,
    generateMeta(data) {
      const {
        email, id, unsubscribe_date,
      } = data;
      return {
        id,
        summary: `User ${email} unsubscribed`,
        ts: Date.parse(unsubscribe_date),
      };
    },
  },
  async run() {
    const listIds = this.lists.map((list) => list.value);
    const lastUnsubscribedDate = this.db.get("lastUnsubscribedDate") || null;

    const unsubscribedUsers = await this.acymailing.getUnsubscribedUsersFromLists({
      listIds,
      lastUnsubscribedDate,
    });

    unsubscribedUsers.forEach((user) => {
      this.$emit(user, this.generateMeta(user));
    });

    if (unsubscribedUsers.length > 0) {
      const mostRecentUnsubscriptionDate = unsubscribedUsers.reduce((max, user) => {
        const currentDate = new Date(user.unsubscribe_date);
        return currentDate > max
          ? currentDate
          : max;
      }, new Date(0));

      this.db.set("lastUnsubscribedDate", mostRecentUnsubscriptionDate.toISOString());
    }
  },
};
