import app from "../../app/clientary.app";
import utils from "../../common/utils";
import { SourceConfig } from "../../common/types";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    app,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    db: "$.service.db",
  },
  methods: {
    setLastCreatedTime(lastCreatedTime: number): void {
      this.db.set("lastCreatedTime", lastCreatedTime);
    },
    getLastCreatedTime(): number {
      return this.db.get("lastCreatedTime") | 0;
    },
    getConfig(): SourceConfig {
      throw new Error("getConfig() is not implemented!");
    },
    getSummary(): string {
      throw new Error("getSummary() is not implemented!");
    },
  },
  async run() {
    const config: SourceConfig = this.getConfig();
    let newLastCreatedTime = this.getLastCreatedTime();
    const resourcesStream = utils.getResourcesStream({
      resourceFn: this.app.getRequestMethod(config.resourceFnName),
      resourceName: config.resourceName,
      hasPaging: config.hasPaging,
    });
    for await (const item of resourcesStream) {
      const createdTime = new Date(item.created_at).getTime();
      if (createdTime > this.getLastCreatedTime()) {
        this.$emit(
          item,
          {
            id: item.id,
            summary: this.getSummary(item),
            ts: createdTime,
          },
        );
      }
      if (newLastCreatedTime < createdTime) {
        newLastCreatedTime = createdTime;
      }
    }
    this.setLastCreatedTime(newLastCreatedTime);
  },
};
