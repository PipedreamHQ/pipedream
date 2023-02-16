import twitter from "../../twitter.app.mjs";
import moment from "moment";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "twitter-search-mentions",
  name: "Search Mentions",
  description: "Emit new Tweets that match your search criteria",
  version: "0.0.10",
  type: "source",
  props: {
    db: "$.service.db",
    twitter,
    q: {
      propDefinition: [
        twitter,
        "q",
      ],
    },
    resultType: {
      propDefinition: [
        twitter,
        "resultType",
      ],
    },
    includeRetweets: {
      propDefinition: [
        twitter,
        "includeRetweets",
      ],
    },
    includeReplies: {
      propDefinition: [
        twitter,
        "includeReplies",
      ],
    },
    lang: {
      propDefinition: [
        twitter,
        "lang",
      ],
    },
    locale: {
      propDefinition: [
        twitter,
        "locale",
      ],
    },
    geocode: {
      propDefinition: [
        twitter,
        "geocode",
      ],
    },
    enrichTweets: {
      propDefinition: [
        twitter,
        "enrichTweets",
      ],
    },
    count: {
      propDefinition: [
        twitter,
        "count",
      ],
    },
    maxRequests: {
      propDefinition: [
        twitter,
        "maxRequests",
      ],
    },
    timer: {
      label: "Polling interval",
      description: "Pipedream will poll the Twitter API on this schedule",
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getSinceId() {
      return this.db.get("sinceId");
    },
    _setSinceId(sinceId) {
      this.db.set("sinceId", sinceId);
    },
  },
  async run() {
    const sinceId = this._getSinceId();
    const {
      lang,
      locale,
      geocode,
      resultType,
      enrichTweets,
      includeReplies,
      includeRetweets,
      maxRequests,
      count,
      q,
    } = this;
    let maxId;
    const limitFirstPage = !sinceId;

    // run paginated search
    const tweets = await this.twitter.paginatedSearch({
      q,
      sinceId,
      lang,
      locale,
      geocode,
      resultType,
      enrichTweets,
      includeReplies,
      includeRetweets,
      maxRequests,
      count,
      limitFirstPage,
    });

    // emit array of tweet objects
    if (tweets.length > 0) {
      tweets.sort(function (a, b) { return a.id - b.id; });

      tweets.forEach((tweet) => {
        this.$emit(tweet, {
          ts: moment(tweet.created_at, "ddd MMM DD HH:mm:ss Z YYYY").valueOf(),
          summary: tweet.full_text || tweet.text,
          id: tweet.id_str,
        });

        if (tweet.id_str > maxId || !maxId) {
          maxId = tweet.id_str;
        }
      });
    }
    if (maxId) {
      this._setSinceId(maxId);
    }
  },
};
