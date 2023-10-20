import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import moment from "moment";
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
      return this.db.get("lastKey") || moment("01/01/1920");
    },
    getParams() {
      return {};
    },
    async startEvent(maxResults: number): Promise<void> {
      const lastKey = this.getLastKey();
      const responseArray: Array<any> = [];
      let tempLastKey = lastKey;

      const items = this.mailbluster.paginate({
        fn: this.getFunc(),
        maxResults,
        field: this.getField(),
        params: this.getParams(),
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
    //This is necessary because if it runs right after deploy it will return error 429
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    await delay(2000);
    return await this.startEvent();
  },
};
