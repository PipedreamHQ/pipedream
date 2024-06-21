import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import snowflake from "../../snowflake.app.mjs";

export default {
  type: "source",
  key: "snowflake-usage-monitor",
  name: "New Usage Monitor",
  description: "Emit new event when a query is executed in the specified params",
  version: "0.1.2",
  dedupe: "unique",
  props: {
    snowflake,
    db: "$.service.db",
    timer: {
      description: "Watch for changes on this schedule",
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    warehouse: {
      type: "string",
      label: "Warehouse",
      description: "The warehouse to monitor",
      optional: true,
    },
    database: {
      type: "string",
      label: "Database Name",
      description: "The name of the database to monitor",
      optional: true,
    },
    username: {
      type: "string",
      label: "Username",
      description: "The username to monitor",
      optional: true,
    },
    role: {
      type: "string",
      label: "Role",
      description: "The role to monitor",
      optional: true,
    },
    schema: {
      type: "string",
      label: "Schema",
      description: "The schema to monitor",
      optional: true,
    },
    totalElapsedTime: {
      type: "string",
      label: "Total Elapsed Time",
      description: "Show register where TOTAL_ELAPSED_TIME >= requested value",
      optional: true,
    },
    bytesScanned: {
      type: "string",
      label: "Bytes Scanned",
      description: "Show register where BYTES_SCANNED >= requested value",
      optional: true,
    },
    rowsProduced: {
      type: "string",
      label: "Rows Produced",
      description: "Show register where ROWS_PRODUCED >= requested value",
      optional: true,
    },
    compilationTime: {
      type: "string",
      label: "Compilation Time",
      description: "Show register where COMPILATION_TIME >= requested value",
      optional: true,
    },
    executionTime: {
      type: "string",
      label: "Execution Time",
      description: "Show register where EXECUTION_TIME >= requested value",
      optional: true,
    },
    queuedProvisioningTime: {
      type: "string",
      label: "Queued Provisioning Time",
      description: "Show register where QUEUED_PROVISIONING_TIME >= requested value",
      optional: true,
    },
    queueRepairTime: {
      type: "string",
      label: "Queue Repair Time",
      description: "Show register where QUEUE_REPAIR_TIME >= requested value",
      optional: true,
    },
    queuedOverloadTime: {
      type: "string",
      label: "Queued Overload Time",
      description: "Show register where QUEUED_OVERLOAD_TIME >= requested value",
      optional: true,
    },
    transactionBlockedTime: {
      type: "string",
      label: "Transaction Blocked Time",
      description: "Show register where TRANSACTION_BLOCKED_TIME >= requested value",
      optional: true,
    },
    creditsUsedCloudServices: {
      type: "string",
      label: "Credit Used Cloud Services",
      description: "Show register where CREDITS_USED_CLOUD_SERVICES >= requested value",
      optional: true,
    },
  },
  methods: {
    updateLastExecutionTime() {
      this.db.set("lastExecutionTime", Date.now());
    },
    getLastExecutionTime() {
      return this.db.get("lastExecutionTime");
    },
    getSqlStatement() {
      const whereClausules = [];
      const binds = [];

      if (this.database) {
        whereClausules.push("and DATABASE_NAME = ?");
        binds.push(this.database);
      }

      if (this.warehouse) {
        whereClausules.push("and WAREHOUSE_NAME = ?");
        binds.push(this.warehouse);
      }

      if (this.username) {
        whereClausules.push("and user_name = ?");
        binds.push(this.username);
      }

      if (this.role) {
        whereClausules.push("and role_name = ?");
        binds.push(this.role);
      }

      if (this.schema) {
        whereClausules.push("and schema_name = ?");
        binds.push(this.schema);
      }

      if (this.totalElapsedTime) {
        whereClausules.push("and TOTAL_ELAPSED_TIME >= ?");
        binds.push(this.totalElapsedTime);
      }

      if (this.bytesScanned) {
        whereClausules.push("and BYTES_SCANNED >= ?");
        binds.push(this.bytesScanned);
      }

      if (this.rowsProduced) {
        whereClausules.push("and ROWS_PRODUCED >= ?");
        binds.push(this.rowsProduced);
      }

      if (this.compilationTime) {
        whereClausules.push("and COMPILATION_TIME >= ?");
        binds.push(this.compilationTime);
      }

      if (this.executionTime) {
        whereClausules.push("and EXECUTION_TIME >= ?");
        binds.push(this.executionTime);
      }

      if (this.queuedProvisioningTime) {
        whereClausules.push("and QUEUED_PROVISIONING_TIME >= ?");
        binds.push(this.queuedProvisioningTime);
      }

      if (this.queueRepairTime) {
        whereClausules.push("and QUEUE_REPAIR_TIME >= ?");
        binds.push(this.queueRepairTime);
      }

      if (this.queuedOverloadTime) {
        whereClausules.push("and QUEUED_OVERLOAD_TIME >= ?");
        binds.push(this.queuedOverloadTime);
      }

      if (this.transactionBlockedTime) {
        whereClausules.push("and TRANSACTION_BLOCKED_TIME >= ?");
        binds.push(this.transactionBlockedTime);
      }

      if (this.creditsUsedCloudServices) {
        whereClausules.push("and CREDITS_USED_CLOUD_SERVICES >= ?");
        binds.push(this.creditsUsedCloudServices);
      }

      return {
        sqlText: `select * from table(information_schema.query_history()) where START_TIME > ? ${whereClausules.join(" ")} order by start_time desc limit 50`,
        binds: [
          new Date(this.getLastExecutionTime()).toISOString(),
          ...binds,
        ],
      };
    },
    async fetchData() {
      return this.snowflake.executeQuery(this.getSqlStatement());
    },
    emit(event) {
      this.$emit(event, {
        summary: event.QUERY_TEXT,
        id: event.QUERY_ID,
        ts: event.START_TIME,
      });
    },
  },
  hooks: {
    async deploy() {
      this.updateLastExecutionTime();
    },
  },
  async run() {
    const rows = await this.fetchData();
    for await (const row of rows) {
      this.emit(row);
    }
    this.updateLastExecutionTime();
  },
};
