import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import app from "../../herobot_chatbot_marketing.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "herobot_chatbot_marketing-new-user-created",
  name: "New User Created",
  description: "Emit new event when a new user is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    app,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getLastDate() {
      return this.db.get("lastDate") || 0;
    },
    _setLastDate(lastDate) {
      this.db.set("lastDate", lastDate);
    },
    generateMeta(user) {
      return {
        id: user.id,
        summary: `New User: ${user.full_name || user.email}`,
        ts: Date.parse(user.subscribed_date),
      };
    },
    async startEvent(maxResults = 0) {
      const lastDate = this._getLastDate();

      let users = this.app.paginate({
        fn: this.app.listUsers,
        maxResults,
      });

      let userArray = [];

      for await (const user of users) {
        userArray.push(user);
      }

      userArray = userArray
        .filter((item) => Date.parse(item.subscribed_date) > lastDate)
        .sort(function(item1, item2) {
          return Date.parse(item1.subscribed_date) < Date.parse(item2.subscribed_date)
            ? -1
            : Date.parse(item1.subscribed_date) > Date.parse(item2.subscribed_date)
              ? 1
              : 0;
        });

      if (userArray.length) this._setLastDate(Date.parse(userArray[0].subscribed_date));

      for (const item of userArray.reverse()) {
        this.$emit(item, this.generateMeta(item));
      }
    },
  },
  hooks: {
    async deploy() {
      await this.startEvent(25);
    },
  },
  async run() {
    await this.startEvent();
  },
  sampleEmit,
};

