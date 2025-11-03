import { axios } from "@pipedream/platform";
import { LIMIT } from "./common/constants.mjs";

export default {
  type: "app",
  app: "etrusted",
  propDefinitions: {
    channelId: {
      type: "string",
      label: "Channel ID",
      description: "The ID of the channel to get reviews for",
      async options() {
        const data = await this.getChannels();

        return data.map(({
          id, name,
        }) => ({
          label: name,
          value: id,
        }));
      },
    },
    reviewId: {
      type: "string",
      label: "Review ID",
      description: "The ID of the review to get",
      async options({
        prevContext, params,
      }) {
        const {
          paging, items,
        } = await this.getListOfReviews({
          params: {
            after: prevContext.next,
            ...params,
          },
        });
        return {
          options: items.map(({
            id: value, title: label,
          }) => ({
            label,
            value,
          })),
          context: {
            next: paging.cursor.after,
          },
        };
      },
    },
    submittedAfter: {
      type: "string",
      label: "Submitted After",
      description: "`Submitted After` is a timestamp in the ISO 8601 and RFC3339 compliant format `yyyy-MM-dd'T'HH:mm:ss.SSSZ`. Check the [glossary](https://developers.etrusted.com/docs/glossory#iso-8601) for examples of valid datetime formats. The list of reviews will only contain reviews submitted with a later timestamp.",
    },
    submittedBefore: {
      type: "string",
      label: "Submitted Before",
      description: "`Submitted Before` is a timestamp in the ISO 8601 and RFC3339 compliant format `yyyy-MM-dd'T'HH:mm:ss.SSSZ`. Check the [glossary](https://developers.etrusted.com/docs/glossory#iso-8601) for examples of valid datetime formats. The list of reviews will only contain reviews submitted with an earlier timestamp.",
    },
    rating: {
      type: "integer[]",
      label: "Rating",
      description: "A list of star ratings to be retrieved. If not set, all reviews are listed. `Example: [1, 2, 5]`",
    },
    status: {
      type: "string[]",
      label: "Status",
      description: "A list of statuses to be retrieved. If not set, all reviews are listed.",
      options: [
        "APPROVED",
        "MODERATION",
        "REJECTED",
      ],
    },
    type: {
      type: "string[]",
      label: "Type",
      description: "A list of review types to be retrieved. If not set, all reviews are listed.",
      options: [
        "SERVICE_REVIEW",
        "PRODUCT_REVIEW",
      ],
    },
    hasReply: {
      type: "boolean",
      label: "Has Reply",
      description: "Reduces the list of reviews to only match reviews that either have been replied to or not. If not set, all reviews are listed.",
    },
    ignoreStatements: {
      type: "boolean",
      label: "Ignore Statements",
      description: "Filters the list to ignore [statements](https://developers.etrusted.com/docs/glossory#statement).",
    },
    query: {
      type: "string",
      label: "Query",
      description: "A full-text search query that is matched against the order reference and email properties.",
    },
    sku: {
      type: "string",
      label: "SKU",
      description: "list of product's SKUs. Be aware, that this parameter does only make sense for product reviews.",
    },
    orderBy: {
      type: "string",
      label: "Order By",
      description: "Specify the date to sort the returned list of reviews by.",
      options: [
        "editedAt",
        "lastEditedAt",
        "updatedAt",
        "submittedAt",
      ],
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of reviews to return. If not set, all reviews are returned.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.etrusted.com";
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(),
        ...opts,
      });
    },
    getChannels() {
      return this._makeRequest({
        path: "/channels",
      });
    },
    getListOfReviews(opts = {}) {
      return this._makeRequest({
        path: "/reviews",
        ...opts,
      });
    },
    getListOfReviewsWithFewerProperties(opts = {}) {
      return this._makeRequest({
        path: "/reviews-minimal",
        ...opts,
      });
    },
    getReviewById({
      reviewId, ...opts
    }) {
      return this._makeRequest({
        path: `/reviews/${reviewId}`,
        ...opts,
      });
    },
    getServiceReviewRating({
      channelId, ...opts
    }) {
      return this._makeRequest({
        path: `/channels/${channelId}/service-reviews/aggregate-rating`,
        ...opts,
      });
    },
    createVetoForReview({
      reviewId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/reviews/${reviewId}/vetos`,
        ...opts,
      });
    },
    getReviewVetoByReviewId({
      reviewId, ...opts
    }) {
      return this._makeRequest({
        path: `/reviews/${reviewId}/vetos`,
        ...opts,
      });
    },
    getTotalReviews(opts = {}) {
      return this._makeRequest({
        path: "/reviews/count",
        ...opts,
      });
    },
    deleteReviewReply({
      reviewId, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/reviews/${reviewId}/reply`,
        ...opts,
      });
    },
    saveReviewReply({
      reviewId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/reviews/${reviewId}/reply`,
        ...opts,
      });
    },
    async *paginate({
      fn, params = {}, maxResults = null, ...opts
    }) {
      let after;
      let count = 0;

      do {
        params.count = LIMIT;
        params.after = after;
        const {
          paging,
          items,
        } = await fn({
          params,
          ...opts,
        });
        for (const d of items) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        after = paging.cursor.after;

      } while (after);
    },
  },
};
