import common from "../../common/common-cloudwatch-logs.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  ...common,
  key: "aws-new-records-returned-by-cloudwatch-logs-insights-query",
  name: "New Records Returned by CloudWatch Logs Insights Query",
  // eslint-disable-next-line pipedream/source-description
  description: "Executes a CloudWatch Logs Insights query on a schedule, and emits the records as invidual events (default) or in batch",
  version: "0.2.4",
  type: "source",
  props: {
    aws: common.props.aws,
    region: common.props.region,
    db: "$.service.db",
    // eslint-disable-next-line pipedream/props-label
    logGroupNames: {
      ...common.props.logGroupName,
      type: "string[]",
      description: "The log groups you'd like to query",
    },
    queryString: {
      label: "Logs Insights Query",
      description: "The query you'd like to run. See [this AWS doc](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_QuerySyntax.html) for help with query syntax",
      type: "string",
    },
    emitResultsInBatch: {
      type: "boolean",
      label: "Emit query results as a single event",
      description: "If `true`, all events are emitted as an array, within a single Pipedream event. If `false`, each row of results is emitted as its own event. Defaults to `true`",
      optional: true,
      default: true,
    },
    timer: {
      label: "Polling schedule",
      description: "How often you want to query CloudWatch Logs Insights for results",
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  async run() {
    const now = +new Date();
    const startTime = this.db.get("startTime") || now - 1000 * 60 * 60;

    // First, start the query
    const params = {
      queryString: this.queryString,
      startTime,
      endTime: now,
      logGroupNames: this.logGroupNames,
    };

    const { queryId } = await this.startQuery(params);

    // Then poll for its status, emitting each record as its own event when completed
    async function sleep(ms) {
      return new Promise((r) => setTimeout(r, ms));
    }

    let result, res;
    do {
      await sleep(1000);
      res = await this.getQueryResults({
        queryId,
      });
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
