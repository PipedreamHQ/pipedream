const aws = require("../../aws.app.js");

module.exports = {
  key: "aws-new-records-returned-by-cloudwatch-logs-insights-query",
  name: "New Records Returned by CloudWatch Logs Insights Query",
  description:
    "Executes a CloudWatch Logs Insights query on a schedule, and emits the records as invidual events (default) or in batch",
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
      label: "CloudWatch Log Groups",
      description: "The log groups you'd like to query",
      type: "string[]",
      async options({ prevContext }) {
        const prevToken = prevContext.nextToken;
        const {
          logGroups,
          nextToken,
        } = await this.aws.logsInsightsDescibeLogGroups(this.region, prevToken);
        const options = logGroups.map((group) => {
          return {
            label: group.logGroupName,
            value: group.logGroupName,
          };
        });
        return {
          options,
          context: {
            nextToken,
          },
        };
      },
    },
    queryString: {
      label: "Logs Insights Query",
      description:
        "The query you'd like to run. See [this AWS doc](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_QuerySyntax.html) for help with query syntax",
      type: "string",
    },
    emitResultsInBatch: {
      type: "boolean",
      label: "Emit query results as a single event",
      description:
        "If `true`, all events are emitted as an array, within a single Pipedream event. If `false`, each row of results is emitted as its own event. Defaults to `true`",
      optional: true,
      default: true,
    },
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 5 * 60,
      },
    },
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
