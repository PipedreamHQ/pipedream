import app from "../app/google_my_business.app";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import { EntityWithCreateTime } from "../common/responseSchemas";

export default {
  props: {
    app,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL as number,
      },
    },
    db: "$.service.db",
    account: {
      propDefinition: [
        app,
        "account",
      ],
    },
    location: {
      propDefinition: [
        app,
        "location",
        ({ account }: { account: string; }) => ({
          account,
        }),
      ],
    },
  },
  hooks: {
    async deploy() {
      await this.getAndProcessData();
    },
  },
  methods: {
    setLastRun(value: string) {
      this.db.set("lastRun", value);
    },
    getLastRun() {
      const lastRun: string = this.db.get("lastRun");
      return lastRun
        ? new Date(lastRun)
        : null;
    },
    getItems() {
      throw new Error("getItems() not implemented in component");
    },
    getSummary() {
      throw new Error("getSummary() not implemented in component");
    },
    async getAndProcessData() {
      const lastRun: Date = this.getLastRun();
      const items: EntityWithCreateTime[] = await this.getItems();
      const ts = Date.now();
      this.setLastRun(ts - 30000);

      const filteredItems = lastRun
        ? items.filter(({ createTime }) => new Date(createTime) >= lastRun)
        : items.slice(-10);

      filteredItems.reverse().forEach((item) => {
        this.$emit(item, {
          id: this.app.getCleanName(item.name),
          summary: this.getSummary(item),
          ts,
        });
      });
    },
  },
  async run() {
    await this.getAndProcessData();
  },
};
