import kenjo from "../../kenjo.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "kenjo-new-performance-review-instant",
  name: "New Performance Review Created",
  description: "Emit a new event when a performance review is created. [See the documentation]()]",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    kenjo: {
      type: "app",
      app: "kenjo",
    },
    emitNewPerformanceReview: {
      propDefinition: [
        "kenjo",
        "emitNewPerformanceReview",
      ],
    },
    filterReviewType: {
      propDefinition: [
        "kenjo",
        "filterReviewType",
      ],
    },
    filterReviewEmployee: {
      propDefinition: [
        "kenjo",
        "filterReviewEmployee",
      ],
    },
    db: "$.service.db",
  },
  methods: {
    _getLastReviewId() {
      return this.db.get("lastReviewId") || null;
    },
    _setLastReviewId(id) {
      return this.db.set("lastReviewId", id);
    },
    _generateId(review) {
      return `${review.employeeId}-${new Date(review.createdAt).getTime()}`;
    },
  },
  hooks: {
    async deploy() {
      const reviews = await this.kenjo.emitNewPerformanceReview();
      reviews.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      for (const review of reviews) {
        const id = review.id || this._generateId(review);
        const summary = `New performance review created for ${review.employeeName}`;
        const ts = Date.parse(review.createdAt) || Date.now();
        this.$emit(review, {
          id,
          summary,
          ts,
        });
        if (!this._getLastReviewId() || review.id > this._getLastReviewId()) {
          this._setLastReviewId(review.id);
        }
      }
    },
  },
  async run() {
    const lastId = this._getLastReviewId();
    const reviews = await this.kenjo.emitNewPerformanceReview();
    reviews.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    for (const review of reviews) {
      if (!lastId || review.id > lastId) {
        const id = review.id || this._generateId(review);
        const summary = `New performance review created for ${review.employeeName}`;
        const ts = Date.parse(review.createdAt) || Date.now();
        this.$emit(review, {
          id,
          summary,
          ts,
        });
        if (!lastId || review.id > lastId) {
          this._setLastReviewId(review.id);
        }
      }
    }
  },
};
