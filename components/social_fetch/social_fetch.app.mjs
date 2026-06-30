import {
  axios, ConfigurationError,
} from "@pipedream/platform";
import {
  API_BASE_URL,
  CONTENT_TYPE_OPTIONS,
  LIST_PROFILE_POSTS_PLATFORMS,
  POST_PLATFORMS,
  PROFILE_PLATFORMS,
  TRANSCRIPT_PLATFORMS,
} from "./common/constants.mjs";
import {
  normalizeHashtag,
  normalizeRegion,
  normalizeSubreddit,
  profileLabel,
  resolveGetPostRoute,
  resolveGetProfileRoute,
  resolveGetTranscriptRoute,
  resolveListProfilePostsRoute,
  stripVideoDetails,
  trimCursor,
} from "./common/routing.mjs";

/**
 * @param {number} status
 * @param {{ error?: { message?: string; requestId?: string };
 *   meta?: { requestId?: string } } | undefined} body
 */
function formatApiError(status, body) {
  const message =
		typeof body?.error?.message === "string"
		  ? body.error.message
		  : `Request failed with status ${status}.`;
  const requestId =
		typeof body?.error?.requestId === "string"
		  ? body.error.requestId
		  : typeof body?.meta?.requestId === "string"
		    ? body.meta.requestId
		    : undefined;
  return requestId
    ? `${message} (requestId: ${requestId})`
    : message;
}

/**
 * Build an Error that surfaces a friendly message but keeps the original
 * axios error reachable via `cause` (status / headers / body).
 */
function wrapApiError(originalError) {
  const status = originalError?.response?.status;
  const body = originalError?.response?.data;
  if (!status) return originalError;
  const err = new Error(formatApiError(status, body), {
    cause: originalError,
  });
  err.status = status;
  return err;
}

export default {
  type: "app",
  app: "social_fetch",
  propDefinitions: {
    platform: {
      type: "string",
      label: "Platform",
      description:
				"Social platform slug (string). E.g. tiktok, instagram, twitter, threads, facebook, linkedin. Provide handle for handle-based platforms; provide profileUrl for facebook or linkedin.",
      options: PROFILE_PLATFORMS,
    },
    postPlatform: {
      type: "string",
      label: "Platform",
      description:
				"Platform slug matching the post URL (string). E.g. tiktok, instagram, twitter, threads, facebook, youtube, linkedin.",
      options: POST_PLATFORMS,
    },
    listPlatform: {
      type: "string",
      label: "Platform",
      description:
				"Platform slug for the profile feed (string). E.g. tiktok, instagram, twitter, threads, facebook.",
      options: LIST_PROFILE_POSTS_PLATFORMS,
    },
    transcriptPlatform: {
      type: "string",
      label: "Platform",
      description:
				"Platform slug matching the media URL (string). E.g. tiktok, instagram, facebook, youtube.",
      options: TRANSCRIPT_PLATFORMS,
    },
    handle: {
      type: "string",
      label: "Handle",
      description:
				"Username or handle without @ (string). Required for tiktok, instagram, twitter, and threads. E.g. nasa.",
      optional: true,
    },
    profileUrl: {
      type: "string",
      label: "Profile URL",
      description:
				"Full profile URL (string, https://). Required for facebook and linkedin. E.g. https://www.linkedin.com/in/janedoe/",
      optional: true,
    },
    postUrl: {
      type: "string",
      label: "Post URL",
      description:
				"Full post, video, or tweet URL (string, https://). E.g. https://www.tiktok.com/@nasa/video/1234567890",
    },
    mediaUrl: {
      type: "string",
      label: "Media URL",
      description:
				"Full video or post URL with audio (string, https://). E.g. https://www.tiktok.com/@nasa/video/1234567890",
    },
    contentType: {
      type: "string",
      label: "Content Type",
      description:
				"Feed content type (string). E.g. videos (TikTok), posts or reels (Instagram), tweets (Twitter), posts (Threads/Facebook).",
      options: CONTENT_TYPE_OPTIONS,
    },
    cursor: {
      type: "string",
      label: "Cursor",
      description: "Pagination cursor from a previous response (`data.page.nextCursor`).",
      optional: true,
    },
    searchQuery: {
      type: "string",
      label: "Query",
      description: "Free-form search term. Plain string, no dropdown.",
    },
  },
  methods: {
    /** @returns {Record<string, string>} */
    _headers() {
      return {
        "x-api-key": `${this.$auth.api_key}`,
      };
    },
    /**
		 * @param {{ $?: unknown; path: string; params?: Record<string, string>;
		 *   headers?: Record<string, string>; [key: string]: unknown }} [args]
		 */
    async _makeRequest({
      $ = this,
      path,
      params,
      headers = {},
      ...opts
    } = {}) {
      try {
        // `...opts` first so the request shape (url / params / headers) we
        // build below can't be silently overwritten by a caller-supplied opt.
        return await axios($, {
          ...opts,
          baseURL: API_BASE_URL,
          url: path,
          headers: {
            ...this._headers(),
            ...headers,
          },
          params,
        });
      } catch (error) {
        throw wrapApiError(error);
      }
    },
    /** @param {Record<string, unknown>} [opts] */
    getCreditBalance(opts = {}) {
      return this._makeRequest({
        path: "/v1/balance",
        ...opts,
      });
    },
    /**
		 * @param {{ platform?: string; handle?: string; profileUrl?: string;
		 *   [key: string]: unknown }} [args]
		 */
    getProfile({
      platform, handle, profileUrl, ...opts
    } = {}) {
      const route = resolveGetProfileRoute(platform, {
        handle,
        profileUrl,
      });
      return this._makeRequest({
        path: route.path,
        params: route.params,
        ...opts,
      });
    },
    /** @param {{ platform?: string; postUrl?: string; [key: string]: unknown }} [args] */
    getPost({
      platform, postUrl, ...opts
    } = {}) {
      const route = resolveGetPostRoute(platform, {
        postUrl,
      });
      return this._makeRequest({
        path: route.path,
        params: route.params,
        ...opts,
      });
    },
    /**
		 * @param {{ platform?: string; contentType?: string; handle?: string;
		 *   profileUrl?: string; cursor?: string; [key: string]: unknown }} [args]
		 */
    listProfilePosts({
      platform,
      contentType,
      handle,
      profileUrl,
      cursor,
      ...opts
    } = {}) {
      const route = resolveListProfilePostsRoute(platform, contentType, {
        handle,
        profileUrl,
        cursor,
      });
      return this._makeRequest({
        path: route.path,
        params: route.params,
        ...opts,
      });
    },
    /** @param {{ platform?: string; mediaUrl?: string; [key: string]: unknown }} [args] */
    getTranscript({
      platform, mediaUrl, ...opts
    } = {}) {
      const route = resolveGetTranscriptRoute(platform, {
        mediaUrl,
      });
      return this._makeRequest({
        path: route.path,
        params: route.params,
        ...opts,
      });
    },
    /**
		 * @param {string} platform
		 * @param {string | undefined} handle
		 * @param {string | undefined} profileUrl
		 */
    profileSummaryLabel(platform, handle, profileUrl) {
      return profileLabel(platform, {
        handle,
        profileUrl,
      });
    },
    /** @param {{ query?: string; cursor?: string; [key: string]: unknown }} [args] */
    searchTiktokUsers({
      query, cursor, ...opts
    } = {}) {
      return this._makeRequest({
        path: "/v1/tiktok/users/search",
        params: {
          query,
          cursor: trimCursor(cursor),
        },
        ...opts,
      });
    },
    /** @param {{ query?: string; cursor?: string; [key: string]: unknown }} [args] */
    async searchTiktokContent({
      query, cursor, ...opts
    } = {}) {
      const response = await this._makeRequest({
        path: "/v1/tiktok/search",
        params: {
          query,
          cursor: trimCursor(cursor),
        },
        ...opts,
      });
      return stripVideoDetails(response);
    },
    /** @param {{ hashtag?: string; cursor?: string; [key: string]: unknown }} [args] */
    async searchTiktokHashtags({
      hashtag, cursor, ...opts
    } = {}) {
      const response = await this._makeRequest({
        path: "/v1/tiktok/search/hashtags",
        params: {
          hashtag: normalizeHashtag(hashtag),
          cursor: trimCursor(cursor),
        },
        ...opts,
      });
      return stripVideoDetails(response);
    },
    /** @param {{ region?: string; [key: string]: unknown }} [args] */
    getTiktokTrendingFeed({
      region, ...opts
    } = {}) {
      return this._makeRequest({
        path: "/v1/tiktok/feed/trending",
        params: {
          region: normalizeRegion(region),
        },
        ...opts,
      });
    },
    /** @param {{ query?: string; page?: number; [key: string]: unknown }} [args] */
    searchTiktokShopProducts({
      query, page, ...opts
    } = {}) {
      return this._makeRequest({
        path: "/v1/tiktok/shop/products/search",
        params: {
          query,
          page,
        },
        ...opts,
      });
    },
    /** @param {{ query?: string; page?: number; [key: string]: unknown }} [args] */
    searchInstagramReels({
      query, page, ...opts
    } = {}) {
      return this._makeRequest({
        path: "/v1/instagram/search/reels",
        params: {
          query,
          page,
        },
        ...opts,
      });
    },
    /** @param {{ query?: string; cursor?: string; [key: string]: unknown }} [args] */
    searchTwitterContent({
      query, cursor, ...opts
    } = {}) {
      return this._makeRequest({
        path: "/v1/twitter/search",
        params: {
          query,
          cursor: trimCursor(cursor),
        },
        ...opts,
      });
    },
    /** @param {{ hashtag?: string; cursor?: string; [key: string]: unknown }} [args] */
    searchTwitterHashtags({
      hashtag, cursor, ...opts
    } = {}) {
      return this._makeRequest({
        path: "/v1/twitter/hashtags",
        params: {
          hashtag: normalizeHashtag(hashtag),
          cursor: trimCursor(cursor),
        },
        ...opts,
      });
    },
    /** @param {{ query?: string; cursor?: string; [key: string]: unknown }} [args] */
    searchYoutubeContent({
      query, cursor, ...opts
    } = {}) {
      return this._makeRequest({
        path: "/v1/youtube/search",
        params: {
          query,
          cursor: trimCursor(cursor),
        },
        ...opts,
      });
    },
    /** @param {{ hashtag?: string; cursor?: string; [key: string]: unknown }} [args] */
    searchYoutubeHashtags({
      hashtag, cursor, ...opts
    } = {}) {
      return this._makeRequest({
        path: "/v1/youtube/search/hashtags",
        params: {
          hashtag: normalizeHashtag(hashtag),
          cursor: trimCursor(cursor),
        },
        ...opts,
      });
    },
    /** @param {Record<string, unknown>} [opts] */
    getYoutubeTrendingShorts(opts = {}) {
      return this._makeRequest({
        path: "/v1/youtube/shorts/trending",
        ...opts,
      });
    },
    /**
		 * @param {{ firstName?: string; lastName?: string;
		 *   [key: string]: unknown }} [args]
		 */
    searchLinkedinPeople({
      firstName, lastName, ...opts
    } = {}) {
      const first = firstName?.trim();
      const last = lastName?.trim();
      if (!first && !last) {
        throw new ConfigurationError("At least one of First Name or Last Name is required.");
      }
      return this._makeRequest({
        path: "/v1/linkedin/people/search",
        params: {
          firstName: first,
          lastName: last,
        },
        ...opts,
      });
    },
    /**
		 * @param {{ subreddit?: string; query?: string; cursor?: string;
		 *   [key: string]: unknown }} [args]
		 */
    searchRedditSubreddits({
      subreddit, query, cursor, ...opts
    } = {}) {
      return this._makeRequest({
        path: "/v1/reddit/subreddits/search",
        params: {
          subreddit: normalizeSubreddit(subreddit),
          query,
          cursor: trimCursor(cursor),
        },
        ...opts,
      });
    },
    /** @param {{ query?: string; cursor?: string; [key: string]: unknown }} [args] */
    searchRedditContent({
      query, cursor, ...opts
    } = {}) {
      return this._makeRequest({
        path: "/v1/reddit/search",
        params: {
          query,
          cursor: trimCursor(cursor),
        },
        ...opts,
      });
    },
    /** @param {{ query?: string; cursor?: string; [key: string]: unknown }} [args] */
    searchThreadsContent({
      query, cursor, ...opts
    } = {}) {
      return this._makeRequest({
        path: "/v1/threads/search",
        params: {
          query,
          cursor: trimCursor(cursor),
        },
        ...opts,
      });
    },
    /** @param {{ query?: string; cursor?: string; [key: string]: unknown }} [args] */
    searchThreadsUsers({
      query, cursor, ...opts
    } = {}) {
      return this._makeRequest({
        path: "/v1/threads/users/search",
        params: {
          query,
          cursor: trimCursor(cursor),
        },
        ...opts,
      });
    },
  },
};
