import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import lemonSqueezy from "../../app/lemon_squeezy.app";

export default {
  props: {
    lemonSqueezy,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    db: "$.service.db",
  },
  methods: {
    setLastId(lastId: number): void {
      this.db.set("lastId", lastId);
    },
    getLastId(): number {
      return this.db.get("lastId") || 0;
    },
    getParams() {
      return {};
    },
    async startEvent(maxResults: number): Promise<void> {
      const lastId = this.getLastId();
      const responseArray: Array<any> = [];
      let tempLastId = lastId;

      const items = this.lemonSqueezy.paginate({
        fn: this.getFunc(),
        params: this.getParams(),
        maxResults,
      });

      for await (const item of items) {
        const newLastId = item.id;
        if (lastId < newLastId) {
          responseArray.push(item);
          if (newLastId > tempLastId) {
            tempLastId = newLastId;
          }
        } else {
          break;
        }
      }

      if (lastId != tempLastId)
        this.setLastId(tempLastId);

      for (const responseItem of responseArray.reverse()) {
        this.$emit(
          responseItem,
          {
            id: responseItem.id,
            summary: this.getSummary(responseItem),
            ts: responseItem.createdAt,
          },
        );
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
};
