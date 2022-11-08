import app from "../../app/buy_me_a_coffee.app";
import utils from "../../common/utils";
import { ResourceFn } from "../../common/types";

export default {
  props: {
    app,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 15 * 60, // 15 minutes
      },
    },
    db: "$.service.db",
  },
  methods: {
    setLastCreatedTime(lastCreatedTime: number): void {
      this.db.set("lastCreatedTime", lastCreatedTime);
    },
    getLastCreatedTime(): number {
      return this.db.get("lastCreatedTime") || 0;
    },
    getResourceFn(): ResourceFn {
      throw new Error("getResourceFn() is not implemented!");
    },
    compareFn(): boolean {
      throw new Error("compareFn() is not implemented!");
    },
    getSummary(): string {
      throw new Error("getSummary() is not implemented!");
    },
    getTimeKey(): string {
      throw new Error("getTimeKey() is not implemented!");
    },
    getIdKey(): string {
      throw new Error("getIdKey() is not implemented!");
    },
  },
  async run() {
    let newLastCreatedTime = this.getLastCreatedTime();
    const resourcesStream = utils.getResourcesStream({
      resourceFn: this.getResourceFn(),
    });
    for await (const item of resourcesStream) {
      const createdTime = new Date(item[this.getTimeKey()]).getTime();
      if (this.compareFn(item)) {
        this.$emit(
          item,
          {
            id: item[this.getIdKey()],
            summary: this.getSummary(item),
            ts: createdTime,
          },
        );
      }
      if (newLastCreatedTime < createdTime) {
        newLastCreatedTime = createdTime;
      }
    }
    this.getLastCreatedTime(newLastCreatedTime);
  },
};
