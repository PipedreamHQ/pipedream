import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import { defineSource } from "@pipedream/types";
import mailbluster from "../../app/mailbluster.app";

export default defineSource({
  ...mailbluster,
  key: "mailbluster-new-created-contact",
  name: "New Product Created",
  description: "Emit new event when a new product is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
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

      const items = this.mailbluster.paginate({
        fn: this.mailbluster.listProducts,
        maxResults,
        field: "products",
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
            summary: `A new product with id ${responseItem.id} was created!`,
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
});
