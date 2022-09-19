import pushshift from "../../pushshift_reddit_search.app.mjs";
import utils from "../../common/utils.mjs";
import base from "../common/base.mjs";

export default {
  key: "pushshift_reddit_search-new-posts-by-search",
  name: "New Posts By Search",
  description: "Emit new event when a search of Reddit posts using the Pushshift.io API returns new results.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...base.props,
    ids: {
      propDefinition: [
        pushshift,
        "ids",
      ],
    },
    q: {
      propDefinition: [
        pushshift,
        "q",
      ],
    },
    qNot: {
      propDefinition: [
        pushshift,
        "qNot",
      ],
    },
    title: {
      propDefinition: [
        pushshift,
        "title",
      ],
    },
    titleNot: {
      propDefinition: [
        pushshift,
        "titleNot",
      ],
    },
    selftext: {
      propDefinition: [
        pushshift,
        "selftext",
      ],
    },
    selftextNot: {
      propDefinition: [
        pushshift,
        "selftextNot",
      ],
    },
    size: {
      propDefinition: [
        pushshift,
        "size",
      ],
    },
    fields: {
      propDefinition: [
        pushshift,
        "fields",
      ],
    },
    sort: {
      propDefinition: [
        pushshift,
        "sort",
      ],
    },
    sortType: {
      propDefinition: [
        pushshift,
        "sortType",
      ],
    },
    aggs: {
      propDefinition: [
        pushshift,
        "aggs",
      ],
    },
    author: {
      propDefinition: [
        pushshift,
        "author",
      ],
    },
    subreddit: {
      propDefinition: [
        pushshift,
        "subreddit",
      ],
    },
    score: {
      propDefinition: [
        pushshift,
        "score",
      ],
    },
    numComments: {
      propDefinition: [
        pushshift,
        "numComments",
      ],
    },
    over18: {
      propDefinition: [
        pushshift,
        "over18",
      ],
    },
    isVideo: {
      propDefinition: [
        pushshift,
        "isVideo",
      ],
    },
    locked: {
      propDefinition: [
        pushshift,
        "locked",
      ],
    },
    stickied: {
      propDefinition: [
        pushshift,
        "stickied",
      ],
    },
    spoiler: {
      propDefinition: [
        pushshift,
        "spoiler",
      ],
    },
    contentMode: {
      propDefinition: [
        pushshift,
        "contentMode",
      ],
    },
    frequency: {
      propDefinition: [
        pushshift,
        "frequency",
      ],
    },
    metadata: {
      propDefinition: [
        pushshift,
        "metadata",
      ],
    },
  },
  methods: {
    ...base.methods,
    generateMeta(post) {
      return {
        id: post.id,
        summary: post.title,
        ts: post.created_utc,
      };
    },
  },
  async run(event) {
    const params = utils.omitEmptyStringValues({
      "ids": this.ids,
      "q": this.q,
      "title": this.title,
      "selftext": this.selftext,
      "size": this.size,
      "fields": this.fields,
      "sort": this.sort,
      "sort_type": this.sortType,
      "aggs": this.aggs,
      "author": this.author,
      "subreddit": this.subreddit,
      "score": this.score,
      "num_comments": this.numComments,
      "over_18": this.over18,
      "is_video": this.isVideo,
      "locked": this.locked,
      "stickied": this.stickied,
      "spoiler": this.spoiler,
      "content_mode": this.contentMode,
      "frequency": this.frequency,
      "metadata": this.metadata,
      "q:not": this.qNot,
      "title:not": this.titleNot,
      "selftext:not": this.selftextNot,
      "after": this._getAfter(),
    });

    const posts = await this.pushshift.searchPosts({
      params,
    });
    for (const post of posts) {
      const meta = this.generateMeta(post);
      this.$emit(post, meta);
    }

    this._setAfter(event.timestamp);
  },
};
