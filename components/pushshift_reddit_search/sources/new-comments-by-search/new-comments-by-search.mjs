import pushshift from "../../pushshift_reddit_search.app.mjs";
import utils from "../../common/utils.mjs";
import base from "../common/base.mjs";

export default {
  key: "pushshift_reddit_search-new-comments-by-search",
  name: "New Comments By Search",
  description: "Emit new event when a search of Reddit comments using the Pushshift.io API returns new results.",
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
    generateMeta(comment) {
      return {
        id: comment.id,
        summary: `New Comment ID: ${comment.id}`,
        ts: comment.created_utc,
      };
    },
  },
  async run(event) {
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
      frequency: this.frequency,
      metadata: this.metadata,
      after: this._getAfter(),
    });

    const comments = await this.pushshift.searchComments({
      params,
    });
    for (const comment of comments) {
      const meta = this.generateMeta(comment);
      this.$emit(comment, meta);
    }

    this._setAfter(event.timestamp);
  },
};
