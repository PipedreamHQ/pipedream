import app from "../../app/persistiq.app";
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
    setExistingIds(existingIds: string[]): void {
      this.db.set("existingIds", existingIds);
    },
    getExistingIds(): string[] {
      return this.db.get("existingIds") || [];
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
    const oldExistingIds: string[] = this.getExistingIds();
    const newExitstingIds: string[] = [];
    const resourcesStream = utils.getResourcesStream({
      resourceFn: this.app[config.resourceFnName],
      resourceName: config.resourceName,
      hasPaging: config.hasPaging,
    });
    for await (const item of resourcesStream) {
      if (!oldExistingIds.includes(item.id)) {
        this.$emit(
          item,
          {
            id: Date.now() + Math.ceil( Math.random() * 1000000000 ), //item id is not number
            ts: Date.now(), //no info about item creation time
            summary: this.getSummary(item),
          },
        );
      }
      newExitstingIds.push(item.id);
    }
    this.setExistingIds(newExitstingIds);
  },
};
