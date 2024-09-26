import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import coassemble from "../../app/coassemble.app";

export default {
  props: {
    coassemble,
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
    async startEvent(maxResults: number = null): Promise<void> {
      const lastId = this.getLastId();
      const responseArray = [];
      let tempLastId = lastId;

      const items = this.coassemble.paginate({
        fn: this.getFunc(),
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
