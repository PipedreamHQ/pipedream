import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import { parseObject } from "../../common/utils.mjs";
import etrusted from "../../etrusted.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "etrusted-new-review",
  name: "New Review",
  description: "Emit new event when a new review is submitted on an eTrusted channel. [See the documentation](https://developers.etrusted.com/reference/getreviews)",
  version: "0.1.0",
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
    lookbackHours: {
      type: "integer",
      label: "Lookback Window (hours)",
      description: "How far back past the newest processed review to keep polling, in hours. Reviews can appear in the API minutes after their `submittedAt` timestamp; reviews re-fetched within this window are deduplicated by review id, so late-indexed reviews are still emitted exactly once.",
      min: 0,
      max: 72,
      default: 1,
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
    _getGraceMs() {
      return (this.lookbackHours ?? 1) * 60 * 60 * 1000;
    },
    _getSeen() {
      return this.db.get("seen") ?? {};
    },
    _setSeen(seen) {
      this.db.set("seen", seen);
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

      return new Date(Date.parse(cursor.submittedAt) - this._getGraceMs()).toISOString();
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
    _isNewReview(review, cursor, seen) {
      if (review.id && seen?.[review.id]) {
        return false;
      }
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
      // Older than the lookback window: no longer fetchable, treat as processed.
      if (reviewTs < cursorTs - this._getGraceMs()) {
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
      const seen = this._getSeen();
      // Sources upgraded from versions without the seen-id map: seed it from
      // the existing cursor so its already-processed ids are not re-emitted.
      // The legacy cursor only records ids at the newest timestamp, so a
      // pre-upgrade review inside the widened lookback window can still be
      // re-fetched and emitted once; the source's "unique" dedupe strategy
      // suppresses that replay at the platform level.
      if (cursor?.submittedAt && !Object.keys(seen).length && cursor.ids?.length) {
        const cursorTs = Date.parse(cursor.submittedAt);
        for (const id of cursor.ids) {
          seen[id] = cursorTs;
        }
      }
      const newReviews = reviews.filter((review) => this._isNewReview(review, cursor, seen));
      const nextCursor = this._getNextCursor(reviews, cursor);

      for (const review of this._sortBySubmittedAt(newReviews)) {
        this._emitReview(review);
        if (review.id) {
          seen[review.id] = this._getTs(review);
        }
      }

      // Prune seen ids that can no longer be re-fetched: the polling query is
      // anchored at (newest submittedAt - lookback window).
      const anchorTs = Date.parse(nextCursor?.submittedAt ?? cursor?.submittedAt);
      if (!Number.isNaN(anchorTs)) {
        const cutoff = anchorTs - this._getGraceMs();
        for (const [id, ts] of Object.entries(seen)) {
          if (ts < cutoff) {
            delete seen[id];
          }
        }
      }
      this._setSeen(seen);

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
