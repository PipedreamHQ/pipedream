import {
  axios, ConfigurationError,
} from "@pipedream/platform";
import {
  API_BASE_URL,
  CONTENT_TYPE_OPTIONS,
  LIST_PROFILE_POSTS_PLATFORMS,
  POST_PLATFORMS,
  PROFILE_PLATFORMS,
  SUBREDDIT_POST_SORT_OPTIONS,
  SUBREDDIT_POST_TIMEFRAME_OPTIONS,
  TRANSCRIPT_PLATFORMS,
} from "./common/constants.mjs";
import {
  normalizeSubreddit,
  profileLabel,
  resolveGetPostRoute,
  resolveGetProfileRoute,
  resolveGetTranscriptRoute,
  resolveListProfilePostsRoute,
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
    subreddit: {
      type: "string",
      label: "Subreddit",
      description:
				"Subreddit name, optional `r/` prefix, or Reddit subreddit URL (string). Must match Reddit's exact casing. E.g. `pics`, `r/pics`, or `https://www.reddit.com/r/pics`.",
    },
    subredditUrl: {
      type: "string",
      label: "Subreddit URL",
      description:
				"Optional full subreddit URL (string, https://). E.g. `https://www.reddit.com/r/pics`.",
      optional: true,
    },
    sort: {
      type: "string",
      label: "Sort",
      description:
				`Sort order for the returned posts (string). One of: ${SUBREDDIT_POST_SORT_OPTIONS.map((v) => `\`${v}\``).join(", ")}.`,
      options: SUBREDDIT_POST_SORT_OPTIONS,
      optional: true,
    },
    timeframe: {
      type: "string",
      label: "Timeframe",
      description:
				`Timeframe used with time-based sort orders such as \`top\` (string). One of: ${SUBREDDIT_POST_TIMEFRAME_OPTIONS.map((v) => `\`${v}\``).join(", ")}.`,
      options: SUBREDDIT_POST_TIMEFRAME_OPTIONS,
      optional: true,
    },
    redditPostUrl: {
      type: "string",
      label: "Post URL",
      description:
				"Link to the Reddit post (string, https://). E.g. `https://www.reddit.com/r/pics/comments/abc123/title/`.",
    },
    trim: {
      type: "boolean",
      label: "Trim",
      description: "When enabled, requests a lighter response shape when available.",
      optional: true,
    },
    language: {
      type: "string",
      label: "Language",
      description:
				"Optional ISO 639-1 language code (two letters) to prefer when multiple caption tracks exist. E.g. `en`.",
      optional: true,
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
      let response;
      try {
        response = await axios($, {
          baseURL: API_BASE_URL,
          url: path,
          headers: {
            ...this._headers(),
            ...headers,
          },
          params,
          ...opts,
        });
      } catch (error) {
        const status = error?.response?.status;
        const body = error?.response?.data;
        if (status) {
          throw new Error(formatApiError(status, body));
        }
        throw error;
      }

      return response;
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
    /** @param {{ subreddit?: string; url?: string; [key: string]: unknown }} [args] */
    getSubreddit({
      subreddit, url, ...opts
    } = {}) {
      return this._makeRequest({
        path: "/v1/reddit/subreddits",
        params: {
          subreddit,
          url,
        },
        ...opts,
      });
    },
    /**
		 * @param {{ subreddit?: string; sort?: string; timeframe?: string;
		 *   cursor?: string; [key: string]: unknown }} [args]
		 */
    listSubredditPosts({
      subreddit, sort, timeframe, cursor, ...opts
    } = {}) {
      const value = normalizeSubreddit(subreddit);
      if (!value) {
        throw new ConfigurationError("Subreddit is required.");
      }
      return this._makeRequest({
        path: `/v1/reddit/subreddits/${encodeURIComponent(value)}/posts`,
        params: {
          sort,
          timeframe,
          cursor,
        },
        ...opts,
      });
    },
    /**
		 * @param {{ url?: string; cursor?: string; trim?: boolean;
		 *   [key: string]: unknown }} [args]
		 */
    listPostComments({
      url, cursor, trim, ...opts
    } = {}) {
      return this._makeRequest({
        path: "/v1/reddit/posts/comments",
        params: {
          url,
          cursor,
          trim,
        },
        ...opts,
      });
    },
    /** @param {{ url?: string; language?: string; [key: string]: unknown }} [args] */
    getPostTranscript({
      url, language, ...opts
    } = {}) {
      return this._makeRequest({
        path: "/v1/reddit/posts/transcript",
        params: {
          url,
          language,
        },
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
  },
};
