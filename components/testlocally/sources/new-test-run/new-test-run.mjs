import testlocally from "../../testlocally.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import { parseObject } from "../../common/utils.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "testlocally-new-test-run",
  name: "New Test Run",
  description: "Emit new event when a new test is run or completed in TestLocally. [See the documentation](https://testlocally.readme.io/reference/api_v0_recent_tests)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    testlocally,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    owners: {
      propDefinition: [
        testlocally,
        "owners",
      ],
    },
    locations: {
      propDefinition: [
        testlocally,
        "locations",
      ],
    },
    target: {
      propDefinition: [
        testlocally,
        "target",
      ],
    },
    scheduled: {
      propDefinition: [
        testlocally,
        "scheduled",
      ],
    },
    browser: {
      propDefinition: [
        testlocally,
        "browser",
      ],
    },
    viewport: {
      propDefinition: [
        testlocally,
        "viewport",
      ],
    },
  },
  methods: {
    _getLastTs() {
      return this.db.get("lastTs") || 0;
    },
    _setLastTs(ts) {
      this.db.set("lastTs", ts);
    },
    generateMeta(test) {
      return {
        id: test.id,
        summary: `New Test Run ID: ${test.id}`,
        ts: test.created,
      };
    },
    async processEvent(max) {
      const lastTs = this._getLastTs();
      const results = this.testlocally.paginate({
        fn: this.testlocally.listTests,
        args: {
          params: {
            owners: parseObject(this.owners),
            locations: parseObject(this.locations),
            target: this.target,
            scheduled: this.scheduled,
            browser: this.browser,
            viewport: this.viewport,
          },
        },
        max,
      });

      const tests = [];
      for await (const test of results) {
        if (test.created > lastTs) {
          tests.push(test);
        } else {
          break;
        }
      }

      if (!tests.length) {
        return;
      }

      this._setLastTs(tests[0].created);

      tests.reverse().forEach((test) => {
        const meta = this.generateMeta(test);
        this.$emit(test, meta);
      });
    },
  },
  hooks: {
    async deploy() {
      await this.processEvent(25);
    },
  },
  async run() {
    await this.processEvent();
  },
  sampleEmit,
};
