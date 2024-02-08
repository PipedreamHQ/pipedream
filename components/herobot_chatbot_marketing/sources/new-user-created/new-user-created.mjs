import { axios } from "@pipedream/platform";
import herobotChatbotMarketing from "../../herobot_chatbot_marketing.app.mjs";

export default {
  key: "herobot_chatbot_marketing-new-user-created",
  name: "New User Created",
  description: "Emits an event when a new user is created. [See the documentation](https://my.herobot.app/api/swagger/)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    herobotChatbotMarketing,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60, // 1 minute
      },
    },
  },
  methods: {
    ...herobotChatbotMarketing.methods,
  },
  hooks: {
    async deploy() {
      // Fetch and emit events for existing users during the first run
      const users = await this.herobotChatbotMarketing.getUsers();
      for (const user of users) {
        this.$emit(user, {
          id: user.id,
          summary: `New User: ${user.name}`,
          ts: Date.parse(user.created_at),
        });
      }
    },
  },
  async run() {
    const lastChecked = this.db.get("lastChecked") || 0;
    const users = await this.herobotChatbotMarketing.getUsers({
      lastChecked,
    });

    for (const user of users) {
      const ts = Date.parse(user.created_at);
      if (ts > lastChecked) {
        this.$emit(user, {
          id: user.id,
          summary: `New User: ${user.name}`,
          ts,
        });
      }
    }

    // Update the last checked timestamp
    const latestTimestamp = Math.max(...users.map((user) => Date.parse(user.created_at)));
    this.db.set("lastChecked", latestTimestamp);
  },
};
