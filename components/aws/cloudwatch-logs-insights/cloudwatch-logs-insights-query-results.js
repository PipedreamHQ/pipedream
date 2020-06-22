const aws = require("https://github.com/PipedreamHQ/pipedream/blob/aws-cloudwatch-logs-insights/components/aws/aws.app.js");
const crypto = require("crypto");

module.exports = {
  name: "CloudWatch Logs Insights Query",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    aws,
    region: {
      label: "AWS Region",
      description: "The AWS region string where your CloudWatch logs reside",
      type: "string",
      default: "us-east-1",
    },
    db: "$.service.db",
    logGroupNames: {
      label: "CloudWatch Log Groups",
      description: "The log groups you'd like to query",
      type: "string[]",
      async options({ page, prevContext }) {
        const { nextToken } = prevContext;
        return await this.aws.logsInsightsDescibeLogGroups(
          this.region,
          nextToken
        );
      },
    },
    queryString: {
      label: "Logs Insights Query",
      description:
        "The query you'd like to run. See [this AWS doc](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_QuerySyntax.html) for help with query syntax",
      type: "string",
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
      res = await cloudwatchlogs.getQueryResults({ queryId }).promise();
      result = res.status;
    } while (result === "Running" || result === "Scheduled");

    if (result !== "Complete") {
      throw new Error(`Query ${queryId} failed with status ${result}`);
    }

    if (!res.results || !res.results.length) {
      console.log("No results, exiting");
      this.db.set("startTime", now);
    }

    console.log(JSON.stringify(res, null, 2));

    for (const item of res.results[0]) {
      const { field, value } = item;
      if (field === "@ptr") {
        return;
      }

      const parsedEvent = JSON.parse(value);
      this.$emit(parsedEvent, {
        summary: this.queryString,
        id: crypto.createHash("md5").update(value).digest("hex"),
      });
    }

    // The next time this source runs, query for data starting now
    this.db.set("startTime", now);
  },
};
