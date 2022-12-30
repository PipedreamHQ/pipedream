import practitest from "../../app/practitest.app";
import { defineSource } from "@pipedream/types";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import { Test } from "../../common/types";

export default defineSource({
  key: "practitest-test-created",
  name: "Test Created",
  description: "Emit new event for each new test",
  version: "0.0.1",
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
    sortByTimestamp<T extends Test>(a: T, b: T) {
      return (
        Date.parse(a.attributes["created-at"]) -
        Date.parse(b.attributes["created-at"])
      );
    },
    async getAndProcessData() {
      const tests = await this.practitest.getTests(this.projectId);
      tests.sort(this.sortByTimestamp).forEach(this.emitEvent);
    },
    emitEvent(data: Test) {
      const {
        id,
        attributes: {
          name, "created-at": ts,
        },
      } = data;

      this.$emit(data, {
        id,
        summary: `ID ${id}: "${name}"`,
        ts: Date.parse(ts),
      });
    },
  },
  async run() {
    await this.getAndProcessData();
  },
});
