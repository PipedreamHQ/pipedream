import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";
import utils from "./common/utils.mjs";

const SCHEDULED_OPTIONS_PAGE_SIZE = 50;

export default {
  type: "app",
  app: "upload_post",
  propDefinitions: {
    user: {
      type: "string",
      label: "Profile",
      description: "The Upload-Post profile username whose connected social accounts are used, e.g. `my_brand`. Use **List Profiles** to find it (the `username` field).",
      async options() {
        const { profiles = [] } = await this.listProfiles();
        return profiles.map(({ username }) => username);
      },
    },
    platforms: {
      type: "string[]",
      label: "Platforms",
      description: "The platform(s) to publish to, e.g. `[\"tiktok\", \"instagram\"]`. Only platforms connected to the given profile are offered; use **List Profiles** to see a profile's connected accounts (the keys of `social_accounts`).",
      async options({
        user, supportedPlatforms = [],
      }) {
        let platforms = supportedPlatforms;
        if (user) {
          const connected = await this.getConnectedPlatforms(user);
          if (connected.length) {
            platforms = supportedPlatforms.filter((p) => connected.includes(p));
          }
        }
        return platforms.map((value) => ({
          label: constants.PLATFORM_LABELS[value] || value,
          value,
        }));
      },
    },
    title: {
      type: "string",
      label: "Title",
      description: "Default title/caption of the post, e.g. `New drop is live! #launch`. Platform-specific titles passed in `additionalFields` (e.g. `tiktok_title`) override it.",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Optional extended text, e.g. `Full changelog at example.com/blog`. Used as LinkedIn commentary, Facebook description, YouTube description, Pinterest note and TikTok photo description; ignored by other platforms.",
      optional: true,
    },
    scheduledDate: {
      type: "string",
      label: "Scheduled Date",
      description: "ISO-8601 date/time to publish at, e.g. `2026-12-31T23:45:00Z`. Must be in the future (up to 365 days). Omit to publish immediately. Cannot be combined with `addToQueue`. The response then contains a `job_id`.",
      optional: true,
    },
    timezone: {
      type: "string",
      label: "Timezone",
      description: "IANA timezone in which `scheduledDate` is interpreted, e.g. `Europe/Madrid`. Defaults to `UTC`.",
      optional: true,
    },
    addToQueue: {
      type: "boolean",
      label: "Add to Queue",
      description: "Set to `true` to schedule the post in the next free slot of the profile's posting queue, e.g. `true`. Cannot be combined with `scheduledDate`. [See the documentation](https://docs.upload-post.com/api/queue-system)",
      optional: true,
      default: false,
    },
    asyncUpload: {
      type: "boolean",
      label: "Async Upload",
      description: "Set to `true` to return immediately with a `request_id` and publish in the background, e.g. `true`. Follow it with **Get Upload Status**. Uploads that take longer than 59 seconds switch to async automatically.",
      optional: true,
      default: false,
    },
    firstComment: {
      type: "string",
      label: "First Comment",
      description: "Comment posted automatically right after publishing, on the platforms that support it, e.g. `Link in bio!`.",
      optional: true,
    },
    externalId: {
      type: "string",
      label: "External ID",
      description: "Your own identifier for this post (max 255 characters), e.g. `cms-post-8841`. It is echoed back by **Get Upload Status**, **List Scheduled Posts** and **Get Upload History**.",
      optional: true,
    },
    privacyLevel: {
      type: "string",
      label: "TikTok Privacy Level",
      description: "TikTok privacy setting, e.g. `PUBLIC_TO_EVERYONE`. TikTok decides per account which levels are available (a private account has no `PUBLIC_TO_EVERYONE`).",
      options: constants.TIKTOK_PRIVACY_LEVELS,
      optional: true,
    },
    visibility: {
      type: "string",
      label: "LinkedIn Visibility",
      description: "LinkedIn visibility setting, e.g. `PUBLIC`. Defaults to `PUBLIC`.",
      options: constants.LINKEDIN_VISIBILITY,
      optional: true,
    },
    mediaType: {
      type: "string",
      label: "Instagram Media Type",
      description: "Type of Instagram media, e.g. `STORIES`.",
      options: [
        "REELS",
        "IMAGE",
        "STORIES",
      ],
      optional: true,
    },
    facebookMediaType: {
      type: "string",
      label: "Facebook Media Type",
      description: "Type of Facebook media, e.g. `STORIES`.",
      options: [
        "REELS",
        "POSTS",
        "VIDEO",
        "STORIES",
      ],
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of results to return per page, e.g. `25`.",
      min: 1,
      optional: true,
    },
    facebookPageId: {
      type: "string",
      label: "Facebook Page ID",
      description: "ID of the Facebook Page to use, e.g. `109876543210987`. Use **List Facebook Pages** to find it (the `id` field). Required when publishing to Facebook unless the profile has a single Page connected or a pinned Page.",
      optional: true,
      async options({ user }) {
        // The endpoint answers 404 when no account of this platform is connected
        const { pages = [] } = await this.listFacebookPages({
          params: {
            profile: user,
          },
        }).catch(() => ({}));
        return pages.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    pinterestBoardId: {
      type: "string",
      label: "Pinterest Board ID",
      description: "ID of the Pinterest board to publish to, e.g. `987654321098765432`. Use **List Pinterest Boards** to find it (the `id` field). Required when publishing to Pinterest.",
      optional: true,
      async options({ user }) {
        // The endpoint answers 404 when no account of this platform is connected
        const { boards = [] } = await this.listPinterestBoards({
          params: {
            profile: user,
          },
        }).catch(() => ({}));
        return boards.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    targetLinkedinPageId: {
      type: "string",
      label: "LinkedIn Page ID",
      description: "ID of the LinkedIn organization page to use instead of the personal profile, e.g. `urn:li:organization:12345678`. Use **List LinkedIn Pages** to find it (the `id` field).",
      optional: true,
      async options({ user }) {
        // The endpoint answers 404 when no account of this platform is connected
        const { pages = [] } = await this.listLinkedinPages({
          params: {
            profile: user,
          },
        }).catch(() => ({}));
        return pages.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    additionalFields: {
      type: "object",
      label: "Additional Fields",
      description: "Any other documented parameter of this endpoint as `field: value` pairs, e.g. `{\"instagram_title\": \"Hello IG\", \"x_first_comment\": \"More soon\", \"tags\": [\"news\", \"ai\"]}`. Array parameters take a JSON array. See the documentation linked in the action description for the full list.",
      optional: true,
    },
    requestId: {
      type: "string",
      label: "Request ID",
      description: "The `request_id` returned by **Upload Video**, **Upload Photos** or **Upload Text**, e.g. `req_123`.",
      optional: true,
    },
    jobId: {
      type: "string",
      label: "Job ID",
      description: "The `job_id` of a scheduled or queued post, e.g. `a1b2c3d4e5f67890a1b2c3d4e5f67890`. Returned by the upload actions when scheduling; use **List Scheduled Posts** to find it (the `job_id` field).",
      optional: true,
    },
    scheduledJobId: {
      type: "string",
      label: "Scheduled Post",
      description: "The `job_id` of the scheduled post, e.g. `a1b2c3d4e5f67890a1b2c3d4e5f67890`. Use **List Scheduled Posts** to find it (the `job_id` field).",
      async options({ page }) {
        const { scheduled_posts: posts = [] } = await this.listScheduledPosts({
          params: {
            limit: SCHEDULED_OPTIONS_PAGE_SIZE,
            offset: page * SCHEDULED_OPTIONS_PAGE_SIZE,
          },
        });
        return posts.map(({
          job_id: value, scheduled_date: date, title, profile_username: profile,
        }) => ({
          label: `${date} - ${profile} - ${title || value}`,
          value,
        }));
      },
    },
    historyPlatform: {
      type: "string",
      label: "Platform",
      description: "Only return uploads to this platform, e.g. `youtube`.",
      options: constants.HISTORY_PLATFORMS.map((value) => ({
        label: constants.PLATFORM_LABELS[value],
        value,
      })),
      optional: true,
    },
    uploadStatus: {
      type: "string",
      label: "Status",
      description: "Only return successful or only failed uploads, e.g. `failed`. Both are returned by default.",
      options: [
        "success",
        "failed",
      ],
      optional: true,
    },
  },
  methods: {
    /**
     * Sends an authenticated request to the Upload-Post API.
     * @param {object} opts - axios options plus `$` and the API `path`
     */
    _makeRequest({
      $ = this, path, headers, ...opts
    }) {
      return axios($, {
        url: `${constants.BASE_URL}${path}`,
        headers: {
          Authorization: `Apikey ${this.$auth.api_key}`,
          ...headers,
        },
        ...opts,
      });
    },
    /**
     * Sends a multipart/form-data POST built from a flat `fields` object.
     * @param {object} opts - `path`, `fields` and extra request options
     */
    _postForm({
      path, fields, ...opts
    }) {
      const form = utils.buildFormData(fields);
      return this._makeRequest({
        method: "POST",
        path,
        data: form,
        headers: form.getHeaders(),
        ...opts,
      });
    },
    /**
     * Returns the platforms with a connected account on the given profile.
     * @param {string} user - profile username
     * @returns {Promise<string[]>}
     */
    async getConnectedPlatforms(user) {
      const { profiles = [] } = await this.listProfiles();
      const profile = profiles.find(({ username }) => username === user);
      if (!profile?.social_accounts) {
        return [];
      }
      return Object.entries(profile.social_accounts)
        .filter(([
          , account,
        ]) => account && typeof account === "object")
        .map(([
          platform,
        ]) => platform);
    },
    /** Publishes a video. */
    uploadVideo(opts = {}) {
      return this._postForm({
        path: "/upload",
        ...opts,
      });
    },
    /** Publishes one or more photos. */
    uploadPhotos(opts = {}) {
      return this._postForm({
        path: "/upload_photos",
        ...opts,
      });
    },
    /** Publishes a text post. */
    uploadText(opts = {}) {
      return this._postForm({
        path: "/upload_text",
        ...opts,
      });
    },
    /** Gets the status of an upload by `request_id` or `job_id`. */
    getUploadStatus(opts = {}) {
      return this._makeRequest({
        path: "/uploadposts/status",
        ...opts,
      });
    },
    /** Lists scheduled posts. */
    listScheduledPosts(opts = {}) {
      return this._makeRequest({
        path: "/uploadposts/schedule",
        ...opts,
      });
    },
    /** Cancels a scheduled post by `jobId`. */
    cancelScheduledPost({
      jobId, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/uploadposts/schedule/${encodeURIComponent(jobId)}`,
        ...opts,
      });
    },
    /** Gets a page of the upload history, most recent first. */
    getUploadHistory(opts = {}) {
      return this._makeRequest({
        path: "/uploadposts/history",
        ...opts,
      });
    },
    /** Lists the profiles of the account. */
    listProfiles(opts = {}) {
      return this._makeRequest({
        path: "/uploadposts/users",
        ...opts,
      });
    },
    /** Gets analytics of a profile by `profileUsername`. */
    getAnalytics({
      profileUsername, ...opts
    }) {
      return this._makeRequest({
        path: `/analytics/${encodeURIComponent(profileUsername)}`,
        ...opts,
      });
    },
    /** Lists the connected Facebook Pages. */
    listFacebookPages(opts = {}) {
      return this._makeRequest({
        path: "/uploadposts/facebook/pages",
        ...opts,
      });
    },
    /** Lists the boards of the connected Pinterest account. */
    listPinterestBoards(opts = {}) {
      return this._makeRequest({
        path: "/uploadposts/pinterest/boards",
        ...opts,
      });
    },
    /** Lists the connected LinkedIn organization pages. */
    listLinkedinPages(opts = {}) {
      return this._makeRequest({
        path: "/uploadposts/linkedin/pages",
        ...opts,
      });
    },
  },
};
