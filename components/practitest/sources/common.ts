import practitest from "../app/practitest.app";
import { defineSource } from "@pipedream/types";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import { PractiTestEntity } from "../common/types";

export default {
  type: "source",
  dedupe: "unique",
  props: {
    practitest,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL as number,
      },
    },
    projectId: {
      propDefinition: [
        practitest,
        "project",
      ],
    },
  },
  hooks: {
    async deploy() {
      await this.getAndProcessData();
    },
  },
  methods: {
    async getData() {
      throw new Error("getData method not implemented for this source!");
    },
    getSummaryName() {
      throw new Error("getSummaryName method not implemented for this source!");
    },
    sortByTimestamp<T extends PractiTestEntity>(a: T, b: T) {
      return (
        Date.parse(a.attributes["created-at"]) -
        Date.parse(b.attributes["created-at"])
      );
    },
    async getAndProcessData() {
      const data: PractiTestEntity[] = await this.getData();
      data.sort(this.sortByTimestamp).forEach(this.emitEvent);
    },
    emitEvent(data: PractiTestEntity) {
      const { id, attributes } = data;

      this.$emit(data, {
        id,
        summary: `ID ${id}: "${this.getSummaryName(attributes)}"`,
        ts: Date.parse(attributes["created-at"]),
      });
    },
  },
  async run() {
    await this.getAndProcessData();
  },
};
