import pushshift from "../../pushshift_reddit_search.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "pushshift_reddit_search-search-reddit-comments",
  name: "Search Reddit Comments",
  description: "Search Reddit comments using the Pushshift.io API. [See the docs here](https://github.com/pushshift/api)",
  version: "0.1.2",
  type: "action",
  props: {
    pushshift,
    q: {
      propDefinition: [
        pushshift,
        "q",
      ],
    },
    ids: {
      propDefinition: [
        pushshift,
        "ids",
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
      q: this.q,
      ids: this.ids,
      size: this.size,
      fields: this.fields,
      sort: this.sort,
      sort_type: this.sortType,
      aggs: this.aggs,
      author: this.author,
      subreddit: this.subreddit,
      after: this.after,
      before: this.before,
      frequency: this.frequency,
      metadata: this.metadata,
    });

    const comments = await this.pushshift.searchComments({
      params,
      $,
    });

    $.export("$summary", `Found ${comments.length} comment(s)`);

    return comments;
  },
};
