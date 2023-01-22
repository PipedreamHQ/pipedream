import snowflake from "../snowflake.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  dedupe: "unique",
  props: {
    snowflake,
    db: "$.service.db",
    timer: {
      description: "Watch for new rows on this schedule",
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    async processCollection(statement, timestamp) {
      const rowStream = await this.snowflake.getRows(statement);
      this.$emit({
        rows: rowStream,
        timestamp,
      });
    },
    async processSingle(statement, timestamp) {
      let lastResultId;
      let rowCount = 0;
      const rowStream = await this.snowflake.getRows(statement);
      for await (const row of rowStream) {
        const meta = this.generateMeta({
          row,
          timestamp,
        });
        this.$emit(row, meta);

        lastResultId = row[this.uniqueKey];
        ++rowCount;
      }

      return {
        lastResultId,
        rowCount,
      };
    },
    getStatement() {
      throw new Error("getStatement is not implemented");
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
    generateMetaForCollection() {
      throw new Error("generateMetaForCollection is not implemented");
    },
    processEvent() {
      throw new Error("processEvent is not implemented");
    },
  },
  async run(event) {
    const { timestamp } = event;
    const statement = this.getStatement(event);
    return this.emitIndividualEvents === true
      ? this.processSingle(statement, timestamp)
      : this.processCollection(statement, timestamp);
  },
};
