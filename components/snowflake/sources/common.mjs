import snowflake from "../snowflake.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
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
  },
  methods: {
    _getLastMaxTimestamp() {
      return this.db.get("lastMaxTimestamp");
    },
    _setLastMaxTimestamp(lastMaxTimestamp) {
      this.db.set("lastMaxTimestamp", lastMaxTimestamp);
    },
    async streamToArray(stream) {
      const result = [];
      for await (const item of stream) {
        result.push(item);
      }
      return result;
    },
    async processCollection(statement, timestamp) {
      const rowStream = await this.snowflake.executeQuery(statement);
      const rows = await this.streamToArray(rowStream);
      this.$emit(rows, this.generateMetaForCollection({
        timestamp,
      }));
    },
    async processSingle(statement, timestamp) {
      let lastResultId;
      let rowCount = 0;
      const rowStream = await this.snowflake.executeQuery(statement);
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
        rowStream,
        lastResultId,
        rowCount,
      };
    },
    filterAndEmitChanges(results, objectType, objectsToEmit, queryTypes) {
      for (const result of results) {
        const {
          QUERY_TEXT: queryText,
          QUERY_ID: queryId,
          EXECUTION_STATUS: queryStatus,
          START_TIME: queryStartTime,
          QUERY_TYPE: queryType,
          USER_NAME: userExecutingQuery,
        } = result;

        // Filter out queries that did not succeed
        if (queryStatus !== "SUCCESS") {
          continue;
        }

        // Filter out queries that are not in the queryTypes array
        if (queryTypes && !queryTypes.includes(queryType)) {
          console.log(`Query type ${queryType} is not in the queryTypes array. Skipping.`);
          continue;
        }

        // Filter out queries that don't match the selected resources, if present
        // eslint-disable-next-line no-useless-escape
        const queryRegex = new RegExp(".*IDENTIFIER\\(\\s*'(?<warehouse>.*?)'\\s*\\)|.*IDENTIFIER\\(\\s*\"(?<warehouse2>.*?)\"\\s*\\)|.*(\\bwarehouse\\s+(?<warehouse3>\\w+))", "i");
        const match = queryText.match(queryRegex);
        console.log(JSON.stringify(match, null, 2));
        const { groups } = match;
        const objectName = groups.warehouse ?? groups.warehouse2 ?? groups.warehouse3;
        console.log(`Matched ${objectType} name: ${objectName}`);
        if (!objectName) continue;
        const formattedObjectName = objectName.replace(/^"|^'|"$|'$/g, "");
        if (objectsToEmit && formattedObjectName && !objectsToEmit.includes(formattedObjectName)) {
          console.log(`${formattedObjectName} not in list of objects to emit. Skipping.`);
          continue;
        }

        console.log(`Emitting ${queryType} ${objectType} ${formattedObjectName}`);

        // Emit the event
        this.$emit({
          objectType,
          objectName: formattedObjectName,
          queryId,
          queryText,
          queryType,
          queryStartTime,
          userExecutingQuery,
          details: result,
        }, {
          id: queryId,
          summary: `${queryType} ${objectType} ${formattedObjectName}`,
          ts: +queryStartTime,
        });
      }
    },
    async watchObjectsAndEmitChanges(objectType, objectsToEmit, queryTypes) {
      // Get the timestamp of the last run, if available. Else set the start time to 1 day ago
      const lastRun = this._getLastMaxTimestamp() ?? +Date.now() - (1000 * 60 * 60 * 24);
      console.log(`Max ts of last run: ${lastRun}`);

      const newMaxTs = await this.snowflake.maxQueryHistoryTimestamp();
      console.log(`New max ts: ${newMaxTs}`);

      const results = await this.snowflake.getChangesForSpecificObject(
        lastRun,
        newMaxTs,
        objectType,
      );
      console.log(`Raw results: ${JSON.stringify(results, null, 2)}`);
      this.filterAndEmitChanges(results, objectType, objectsToEmit, queryTypes);
      this._setLastMaxTimestamp(newMaxTs);
    },
    async emitFailedTasks({
      database, schemas, taskName,
    }) {
      // Get the timestamp of the last run, if available. Else set the start time to 1 day ago
      const lastRun = this._getLastMaxTimestamp() ?? +Date.now() - (1000 * 60 * 60 * 24);
      console.log(`Max ts of last run: ${lastRun}`);

      let results;
      const opts = {
        startTime: lastRun,
        taskName,
      };

      if (database && schemas) {
        results = await this.snowflake.getFailedTasksInDatabase({
          ...opts,
          database,
          schemas,
        });
      } else {
        throw new Error("Must provide a database and schema");
      }

      console.log(`Raw results: ${JSON.stringify(results, null, 2)}`);

      for (const result of results) {
        const {
          QUERY_ID: queryId,
          QUERY_TEXT: queryText,
          NAME: taskName,
          DATABASE_NAME: taskDatabase,
          SCHEMA_NAME: taskSchema,
          ERROR_CODE: errorCode,
          ERROR_MESSAGE: errorMessage,
          QUERY_START_TIME: queryStartTime,
          NEXT_SCHEDULE_TIME: nextScheduleTime,
          SCHEDULED_TIME: scheduledTime,
          COMPLETED_TIME: completedTime,
          RUN_ID: runId,
          SCHEDULED_FROM: scheduledFrom,
        } = result;

        this.$emit(
          {
            taskName,
            taskDatabase,
            taskSchema,
            queryId,
            queryText,
            errorCode,
            errorMessage,
            queryStartTime,
            nextScheduleTime,
            scheduledTime,
            completedTime,
            runId,
            scheduledFrom,
          },
          {
            id: runId,
            summary: `Failed task ${taskName}`,
            ts: +queryStartTime,
          },
        );
      }

      this._setLastMaxTimestamp(Date.now());
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
    alwaysRunInSingleProcessMode() {
      return false;
    },
  },
  async run(event) {
    const { timestamp } = event;
    const statement = this.getStatement(event);
    const data = this.emitIndividualEvents === true || this.alwaysRunInSingleProcessMode()
      ? await this.processSingle(statement, timestamp)
      : await this.processCollection(statement, timestamp);

    if (this.additionalProccessing) {
      this.additionalProccessing(data);
    }
    return data;
  },
};
