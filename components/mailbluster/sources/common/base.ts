import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import mailbluster from "../../app/mailbluster.app";

export default {
  ...mailbluster,
  props: {
    mailbluster,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    db: "$.service.db",
  },
  methods: {
    setLastKey(lastKey: number): void {
      this.db.set("lastKey", lastKey);
    },
    getLastKey(): number {
      return this.db.get("lastKey") || 0;
    },
    async startEvent(maxResults: number = null): Promise<void> {
      const lastKey = this.getLastKey();
      const responseArray = [];
      let tempLastKey = lastKey;

      const items = this.mailbluster.paginate({
        fn: this.getFunc(),
        maxResults,
        field: this.getField(),
      });

      for await (const item of items) {
        const newLastKey = item.createdAt;
        if (this.validateKeys(newLastKey, lastKey)) {
          responseArray.push(item);
          if (this.validateKeys(newLastKey, tempLastKey)) {
            tempLastKey = newLastKey;
          }
        } else {
          break;
        }
      }

      this.setLastKey(tempLastKey);

      for (const responseItem of responseArray.reverse()) {
        this.$emit(
          responseItem,
          {
            id: responseItem.id,
            summary: `A new order with id ${responseItem.id} was created!`,
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
