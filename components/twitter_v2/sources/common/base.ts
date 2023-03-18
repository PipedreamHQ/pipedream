import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import app from "../../app/twitter_v2.app";
import { TwitterEntity } from "../../common/types/responseSchemas";

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
    getItemName(): string {
      throw new Error("getItemName() not implemented in component");
    },
    async getResources(): Promise<string[]> {
      throw new Error("getResources() not implemented in component");
    },
    getSavedIds(): string[] {
      return this.db.get("savedEntityIds");
    },
    setSavedIds(data: string[]) {
      this.db.set("savedEntityIds", data);
    },
    async getAndProcessData(emit = false) {
      const data: TwitterEntity[] = await this.getResources(emit);
      if (data) {
        const savedIds: string[] = this.getSavedIds() ?? [];

        data.filter(({ id }) => !savedIds.includes(id)).reverse()
          .forEach((obj) => {
            if (emit) this.emitEvent(obj);
            const { id } = obj;
            savedIds.push(id);
          });

        this.setSavedIds(savedIds);
      }
    },
    emitEvent(data: TwitterEntity) {
      const ts = Date.now();
      const { id } = data;
      this.$emit(data, {
        id,
        summary: `New ${this.getEntityName()}: "${this.getItemName(data)}"`,
        ts,
      });
    },
  },
  async run() {
    await this.getAndProcessData(true);
  },
};
