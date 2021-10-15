const aws = require("../../aws.app.js");
const { toSingleLineString } = require("../common/utils");

module.exports = {
  type: "source",
  key: "aws-new-records-returned-by-cloudwatch-logs-insights-query",
  name: "New CloudWatch Logs Insights",
  description: toSingleLineString(`
    Executes a CloudWatch Logs Insights query on a schedule, and
    emits the records as invidual events (default) or in batch
  `),
  version: "0.0.3",
  props: {
    aws,
    region: {
      propDefinition: [
        aws,
        "region",
      ],
    },
    db: "$.service.db",
    logGroupNames: {
      propDefinition: [
        aws,
        "logGroupNames",
      ],
    },
    queryString: {
      propDefinition: [
        aws,
        "queryString",
      ],
    },
    emitResultsInBatch: {
      propDefinition: [
        aws,
        "emitResultsInBatch",
      ],
      optional: true,
      default: true,
    },
    /* eslint-disable pipedream/props-label, pipedream/props-description */
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 5 * 60,
      },
    },
    /* eslint-enable pipedream/props-label, pipedream/props-description */
  },
  async run() {
    const now = +new Date();
    const startTime = this.db.get("startTime") || now - 1000 * 60 * 60;

    const AWS = this.aws.sdk(this.region);
    const cloudwatchlogs = new AWS.CloudWatchLogs();

    // First, start the query
    const params = {
      queryString: this.queryString,
      startTime,
      endTime: now,
      logGroupNames: this.logGroupNames,
    };

    const { queryId } = await cloudwatchlogs.startQuery(params).promise();

    // Then poll for its status, emitting each record as its own event when completed
    async function sleep(ms) {
      return new Promise((r) => setTimeout(r, ms));
    }

    let result, res;
    do {
      await sleep(1000);
      res = await cloudwatchlogs.getQueryResults({
        queryId,
      }).promise();
      result = res.status;
    } while (result === "Running" || result === "Scheduled");

    if (result !== "Complete") {
      throw new Error(`Query ${queryId} failed with status ${result}`);
    }

    console.log(JSON.stringify(res, null, 2));
    const { results } = res;

    if (!results || !results.length) {
      console.log("No results, exiting");
      this.db.set("startTime", now);
      return;
    }

    if (this.emitResultsInBatch === true) {
      this.$emit(results, {
        summary: JSON.stringify(results),
      });
    } else {
      for (const item of results) {
        this.$emit(item, {
          summary: JSON.stringify(item),
        });
      }
    }

    // The next time this source runs, query for data starting now
    this.db.set("startTime", now);
  },
};
