import pushshift from "../../pushshift_reddit_search.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "pushshift_reddit_search-search-reddit-posts",
  name: "Search Reddit Posts",
  description: "Search Reddit posts using the Pushshift.io API. [See the docs here](https://github.com/pushshift/api)",
  version: "0.1.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    pushshift,
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
    after: {
      propDefinition: [
        pushshift,
        "after",
      ],
    },
    before: {
      propDefinition: [
        pushshift,
        "before",
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
  async run({ $ }) {
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
      "after": this.after,
      "before": this.before,
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
    });

    const posts = await this.pushshift.searchPosts({
      params,
      $,
    });

    $.export("$summary", `Found ${posts.length} posts(s)`);

    return posts;
  },
};
