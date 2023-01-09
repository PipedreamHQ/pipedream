import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import raven_tools from "../app/raven_tools.app";
import { Domain } from "../common/types";
import { RavenToolsEntity } from "../common/types";

export default {
  props: {
    raven_tools,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL as number,
      },
    },
  },
  hooks: {
    async deploy() {
      await this.getAndProcessData();
    },
  },
  methods: {
    getEntityName(): string {
      return "Entity";
    },
    async getResources(): Promise<RavenToolsEntity[]> {
      throw new Error("getResources not implemented in component");
    },
    getSavedEntities(): RavenToolsEntity[] {
      return this.db.get("savedData");
    },
    setSavedEntities(data: RavenToolsEntity[]) {
      this.db.set("savedData", data);
    },
    async getAndProcessData() {
      const data: RavenToolsEntity[] = await this.getResources();
      const savedEntities: RavenToolsEntity[] = this.getSavedEntities() ?? [];
      data.filter((d) => !savedEntities.includes(d)).forEach(this.emitEvent);
      this.setSavedEntities(data);
    },
    emitEvent(data: Domain) {
      const ts = Date.now();
      this.$emit(data, {
        id: ts + data,
        summary: `New ${this.getEntityName()}: "${data}"`,
        ts,
      });
    },
  },
  async run() {
    await this.getAndProcessData();
  },
};
