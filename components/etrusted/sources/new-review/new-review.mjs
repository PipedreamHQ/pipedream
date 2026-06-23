import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import { parseObject } from "../../common/utils.mjs";
import etrusted from "../../etrusted.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "etrusted-new-review",
  name: "New Review",
  description: "Emit new event when a new review is submitted on an eTrusted channel. [See the documentation](https://developers.etrusted.com/reference/getreviews)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    etrusted,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      label: "Polling Schedule",
      description: "How often to poll the eTrusted Reviews API.",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    channelId: {
      propDefinition: [
        etrusted,
        "channelId",
      ],
      type: "string[]",
      optional: true,
    },
    type: {
      propDefinition: [
        etrusted,
        "type",
      ],
      optional: true,
    },
    status: {
      propDefinition: [
        etrusted,
        "status",
      ],
      optional: true,
    },
    rating: {
      propDefinition: [
        etrusted,
        "rating",
      ],
      optional: true,
    },
    ignoreStatements: {
      propDefinition: [
        etrusted,
        "ignoreStatements",
      ],
      optional: true,
    },
  },
  methods: {
    _getLastSubmittedAt() {
      return this.db.get("lastSubmittedAt");
    },
    _setLastSubmittedAt(value) {
      this.db.set("lastSubmittedAt", value);
    },
    _getParams() {
      return {
        channels: parseObject(this.channelId)?.join(","),
        type: parseObject(this.type)?.join(","),
        status: parseObject(this.status)?.join(","),
        rating: parseObject(this.rating)?.join(","),
        ignoreStatements: this.ignoreStatements,
        orderBy: "submittedAt",
      };
    },
    _getSubmittedAt(review) {
      return review.submittedAt ?? review.submitted_at ?? review.createdAt ?? review.created_at;
    },
    _getTs(review) {
      const submittedAt = this._getSubmittedAt(review);
      return submittedAt
        ? Date.parse(submittedAt)
        : Date.now();
    },
    _getSummary(review) {
      const rating = review.rating
        ? ` (${review.rating} star${review.rating === 1
          ? ""
          : "s"})`
        : "";
      return `New review${rating}: ${review.title ?? review.id}`;
    },
    _emitReview(review) {
      this.$emit(review, {
        id: review.id,
        summary: this._getSummary(review),
        ts: this._getTs(review),
      });
    },
    async _getReviews({
      maxResults,
      submittedAfter,
    } = {}) {
      const response = this.etrusted.paginate({
        fn: this.etrusted.getListOfReviews,
        params: {
          ...this._getParams(),
          submittedAfter,
        },
        maxResults,
      });

      const reviews = [];
      for await (const review of response) {
        reviews.push(review);
      }
      return reviews;
    },
    _processReviews(reviews) {
      if (!reviews.length) {
        return;
      }

      const newestSubmittedAt = this._getSubmittedAt(reviews[0]);
      for (const review of reviews.reverse()) {
        this._emitReview(review);
      }

      if (newestSubmittedAt) {
        this._setLastSubmittedAt(newestSubmittedAt);
      }
    },
  },
  hooks: {
    async deploy() {
      const reviews = await this._getReviews({
        maxResults: 10,
      });
      this._processReviews(reviews);
    },
  },
  async run() {
    const reviews = await this._getReviews({
      submittedAfter: this._getLastSubmittedAt(),
    });
    this._processReviews(reviews);
  },
  sampleEmit,
};
