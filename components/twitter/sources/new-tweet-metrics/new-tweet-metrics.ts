import { defineSource } from "@pipedream/types";
import common from "../common/base";
import { GetTweetParams } from "../../common/types/requestParams";
import { METRICS_FIELDS } from "../../common/dataFields";
import { Tweet } from "../../common/types/responseSchemas";

const DOCS_LINK = "https://developer.twitter.com/en/docs/twitter-api/metrics";

export default defineSource({
  ...common,
  key: "twitter-new-tweet-metrics",
  name: "New Tweet Metrics",
  description: `Emit new event when a Tweet has new metrics [See the documentation](${DOCS_LINK})`,
  version: "1.0.5",
  type: "source",
  props: {
    ...common.props,
    tweetId: {
      propDefinition: [
        common.props.app,
        "tweetId",
      ],
    },
    metricsFields: {
      type: "string[]",
      label: "Metrics Fields",
      description: "The types of metrics to request for the specified Tweet.",
      options: METRICS_FIELDS,
    },
  },
  methods: {
    ...common.methods,
    getSavedMetrics(): string {
      return this.db.get("savedMetrics");
    },
    setSavedMetrics(data: string) {
      this.db.set("savedMetrics", data);
    },
    async getAndProcessData() {
      const params: GetTweetParams = {
        $: this,
        tweetId: this.tweetId,
        params: {
          "tweet.fields": this.metricsFields?.join(),
        },
      };

      const data: Tweet = (await this.app.getTweet(params))?.data;
      if (data) {
        const {
          non_public_metrics,
          organic_metrics,
          promoted_metrics,
          public_metrics,
        } = data;

        const stringifiedObj = JSON.stringify({
          non_public_metrics,
          organic_metrics,
          promoted_metrics,
          public_metrics,
        });

        const savedMetrics: string = this.getSavedMetrics();
        if (savedMetrics !== stringifiedObj) {
          const ts = Date.now();
          this.$emit(data, {
            id: ts,
            summary: "New Metrics",
            ts,
          });
          this.setSavedMetrics(stringifiedObj);
        }
      }
    },
  },
});
