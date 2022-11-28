import social_intents from "../../social_intents.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  name: "New Chat Closed",
  version: "0.0.1",
  key: "social_intents-new-chat-closed",
  description: "Emit new event for each closed chat.",
  type: "source",
  dedupe: "unique",
  props: {
    social_intents,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      static: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    emitEvent(data) {
      this.$emit(data, {
        id: data.id,
        summary: `New chat closed with id ${data.id}`,
        ts: new Date(),
      });
    },
    _setLastSyncTime(time) {
      this.db.set("lastSyncTime", time);
    },
    _getLastSyncTime() {
      return this.db.get("lastSyncTime");
    },
  },
  hooks: {
    async deploy() {
      this._setLastSyncTime(new Date().getTime());

      const { chats } = await this.social_intents.getChats();

      chats.slice(-10).reverse()
        .forEach(this.emitEvent);
    },
  },
  async run() {
    const lastSyncTime = this._getLastSyncTime();
    this._setLastSyncTime(new Date().getTime());

    const { chats } = await this.social_intents.getChats();

    const filteredChats = chats.filter((chat) => Date.parse(chat.startDate) < lastSyncTime);

    filteredChats.reverse().forEach(this.emitEvent);
  },
};
