import twitter from "../../twitter.app.mjs";

export default {
  props: {
    db: "$.service.db",
    twitter,
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
        intervalSeconds: 60 * 15,
      },
    },
  },
  methods: {
    _compareByIdAsc({ id_str: a }, { id_str: b }) {
      const A = BigInt(a);
      const B = BigInt(b);
      if (A < B) return -1;
      if (A > B) return 1;
      return 0;
    },
    sortTweets(tweets) {
      return tweets
        .sort(this._compareByIdAsc);
    },
    /**
     * This function returns the Twitter screen name of the subject account
     *
     * @returns a string containing the relevant Twitter screen name
     */
    getScreenName() {
      throw new Error("getScreenName is not implemented");
    },
    /**
     * This function provides the list of options for the `tweetId` user prop.
     * It is meant to be called by Pipedream during the setup of the user prop
     * and not during normal operations of the event source.
     *
     * @param {object}  context the context object for the pagination of the
     * prop options
     * @param {object}  context.prevContext the context object of a previous
     * call to this method
     * @returns an object containing the list of Tweet ID options for the
     * `tweetId` user prop and the context for pagination
     */
    async tweetIdOptions(context) {
      const { prevContext = {} } = context;
      const {
        screenName = await this.getScreenName(),
        sinceId = "1",
      } = prevContext;

      const userTimelineOpts = {
        screenName,
        sinceId,
        count: 10,
        trim_user: true,
        exclude_replies: false,
        include_rts: false,
      };
      const tweets = await this.twitter.getUserTimeline(userTimelineOpts);
      if (tweets.length === 0) {
        // There are no more tweets to go through
        return {
          options: null,
          context: prevContext,
        };
      }

      const sortedTweets = this.sortTweets(tweets);
      const { id_str: lastId } = sortedTweets[sortedTweets.length - 1];
      const options = sortedTweets.map(({
        full_text: fullText,
        id_str: idStr,
      }) => ({
        label: fullText,
        value: idStr,
      }));

      return {
        options,
        context: {
          screenName,
          sinceId: lastId,
        },
      };
    },
    getSinceId() {
      return this.db.get("sinceId") || "1";
    },
    setSinceId(sinceId = "1") {
      this.db.set("sinceId", sinceId);
    },
    generateMeta(tweet) {
      const {
        created_at: createdAt,
        full_text: fullText,
        id_str: id,
        text,
      } = tweet;
      const summary = fullText || text;
      const ts = this.twitter.parseDate(createdAt);
      return {
        id,
        summary,
        ts,
      };
    },
    /**
     * The purpose of this function is to retrieve the relevant Tweets for the
     * event source that implements it. For example, if the event source emits
     * an event for each new Tweet of a specific user, the implementation of
     * this function will perform the retrieval of such Tweets and return it as
     * a list of [Tweet
     * objects](https://developer.twitter.com/en/docs/twitter-api/v1/data-dictionary/object-model/tweet)
     *
     * @returns a list of Tweet objects for which to emit new events
     */
    retrieveTweets() {
      throw new Error("retrieveTweets is not implemented");
    },
  },
  async run() {
    const tweets = await this.retrieveTweets();
    if (tweets.length === 0) {
      console.log("No new tweets available. Skipping...");
      return;
    }

    const sortedTweets = this.sortTweets(tweets);
    const { id_str: lastId } = sortedTweets[sortedTweets.length - 1];
    this.setSinceId(lastId);

    // Emit array of tweet objects
    sortedTweets.forEach((tweet) => {
      const meta = this.generateMeta(tweet);
      this.$emit(tweet, meta);
    });
  },
};
