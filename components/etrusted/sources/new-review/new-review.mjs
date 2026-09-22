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
    _getCursor() {
      return this.db.get("cursor") ?? {
        submittedAt: this.db.get("lastSubmittedAt"),
        ids: [],
      };
    },
    _setCursor(cursor) {
      this.db.set("cursor", cursor);
    },
    _toCsv(value) {
      const parsed = parseObject(value);
      if (parsed == null || parsed === "") {
        return undefined;
      }
      if (Array.isArray(parsed)) {
        const values = parsed.filter((item) => item != null && item !== "");
        return values.length
          ? values.join(",")
          : undefined;
      }
      return String(parsed);
    },
    _getParams() {
      return {
        channels: this._toCsv(this.channelId),
        type: this._toCsv(this.type),
        status: this._toCsv(this.status),
        rating: this._toCsv(this.rating),
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
    _getSubmittedAfter(cursor) {
      if (!cursor?.submittedAt) {
        return undefined;
      }

      return new Date(Date.parse(cursor.submittedAt) - 1).toISOString();
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
    _isNewReview(review, cursor) {
      if (!cursor?.submittedAt) {
        return true;
      }

      const submittedAt = this._getSubmittedAt(review);
      if (!submittedAt) {
        return true;
      }

      const reviewTs = Date.parse(submittedAt);
      const cursorTs = Date.parse(cursor.submittedAt);
      if (reviewTs > cursorTs) {
        return true;
      }
      if (reviewTs < cursorTs) {
        return false;
      }

      return !cursor.ids?.includes(review.id);
    },
    _sortBySubmittedAt(reviews) {
      return reviews.sort((a, b) => this._getTs(a) - this._getTs(b));
    },
    _getNextCursor(reviews, cursor) {
      const withSubmittedAt = reviews.filter((review) => this._getSubmittedAt(review));
      if (!withSubmittedAt.length) {
        return cursor;
      }

      const newestSubmittedAt = withSubmittedAt.reduce((max, review) => {
        const submittedAt = this._getSubmittedAt(review);
        return !max || Date.parse(submittedAt) > Date.parse(max)
          ? submittedAt
          : max;
      }, null);
      const ids = withSubmittedAt
        .filter((review) => this._getSubmittedAt(review) === newestSubmittedAt)
        .map((review) => review.id);

      if (cursor?.submittedAt === newestSubmittedAt) {
        ids.push(...(cursor.ids ?? []));
      }

      return {
        submittedAt: newestSubmittedAt,
        ids: [
          ...new Set(ids),
        ],
      };
    },
    _processReviews(reviews) {
      if (!reviews.length) {
        return;
      }

      const cursor = this._getCursor();
      const newReviews = reviews.filter((review) => this._isNewReview(review, cursor));
      const nextCursor = this._getNextCursor(reviews, cursor);

      for (const review of this._sortBySubmittedAt(newReviews)) {
        this._emitReview(review);
      }

      if (nextCursor?.submittedAt) {
        this._setCursor(nextCursor);
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
    const cursor = this._getCursor();
    const reviews = await this._getReviews({
      submittedAfter: this._getSubmittedAfter(cursor),
    });
    this._processReviews(reviews);
  },
  sampleEmit,
};
