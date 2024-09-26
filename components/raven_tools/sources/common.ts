import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import app from "../app/raven_tools.app";

export default {
  props: {
    app,
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
    async getResources(): Promise<string[]> {
      throw new Error("getResources not implemented in component");
    },
    getSavedEntities(): string[] {
      return this.db.get("savedData");
    },
    setSavedEntities(data: string[]) {
      this.db.set("savedData", data);
    },
    async getAndProcessData() {
      const data: string[] = await this.getResources();
      if (data) {
        const savedEntities: string[] = this.getSavedEntities() ?? [];
        data.filter((d) => !savedEntities.includes(d)).forEach(this.emitEvent);
        this.setSavedEntities(data);
      }
    },
    emitEvent(data: string) {
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
