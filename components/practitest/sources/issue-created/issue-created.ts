import practitest from "../../app/practitest.app";
import { defineSource } from "@pipedream/types";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import { Issue } from "../../common/types";

export default defineSource({
  key: "practitest-issue-created",
  name: "Issue Created",
  description: "Emit new event for each new issue",
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
    sortByTimestamp<T extends Issue>(a: T, b: T) {
      return (
        Date.parse(a.attributes["created-at"]) -
        Date.parse(b.attributes["created-at"])
      );
    },
    async getAndProcessData() {
      const issues = await this.practitest.getIssues();
      issues.sort(this.sortByTimestamp).forEach(this.emitEvent);
    },
    emitEvent(data: Issue) {
      const {
        id,
        attributes: {
          title, "created-at": ts,
        },
      } = data;

      this.$emit(data, {
        id,
        summary: `ID ${id}: "${title}"`,
        ts: Date.parse(ts),
      });
    },
  },
  async run() {
    await this.getAndProcessData();
  },
});
