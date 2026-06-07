import { axios } from "@pipedream/platform";
import {
  API_BASE_URL,
  CONTENT_TYPE_OPTIONS,
  LIST_PROFILE_POSTS_PLATFORMS,
  POST_PLATFORMS,
  PROFILE_PLATFORMS,
  TRANSCRIPT_PLATFORMS,
} from "./common/constants.mjs";
import {
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
				"Select the social platform. Handle-based platforms need a username; Facebook and LinkedIn need a full profile URL.",
      options: PROFILE_PLATFORMS,
    },
    postPlatform: {
      type: "string",
      label: "Platform",
      description: "Select the platform that matches the post URL you are looking up.",
      options: POST_PLATFORMS,
    },
    listPlatform: {
      type: "string",
      label: "Platform",
      description: "Select the platform for the profile feed you are listing.",
      options: LIST_PROFILE_POSTS_PLATFORMS,
    },
    transcriptPlatform: {
      type: "string",
      label: "Platform",
      description: "Select the platform that matches the video or post URL.",
      options: TRANSCRIPT_PLATFORMS,
    },
    handle: {
      type: "string",
      label: "Handle",
      description:
				"Username or handle (without @) for TikTok, Instagram, Twitter/X, or Threads.",
      optional: true,
    },
    profileUrl: {
      type: "string",
      label: "Profile URL",
      description:
				"Full profile page URL for Facebook or LinkedIn. Paste the URL from the browser address bar.",
      optional: true,
    },
    postUrl: {
      type: "string",
      label: "Post URL",
      description:
				"Full URL of the post, video, or tweet. Paste the link from your browser address bar.",
    },
    mediaUrl: {
      type: "string",
      label: "Media URL",
      description: "Full URL of the video or post with audio.",
    },
    contentType: {
      type: "string",
      label: "Content Type",
      description:
				"Videos for TikTok; Posts or Reels for Instagram; Tweets for Twitter / X; Posts for Threads and Facebook.",
      options: CONTENT_TYPE_OPTIONS,
    },
    cursor: {
      type: "string",
      label: "Cursor",
      description: "Pagination cursor from a previous response (`data.page.nextCursor`).",
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
		 *   [key: string]: unknown }} [args]
		 */
    async _makeRequest({
      $ = this, path, params, ...opts
    } = {}) {
      let response;
      try {
        response = await axios($, {
          url: `${API_BASE_URL}${path}`,
          headers: this._headers(),
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
  },
};
