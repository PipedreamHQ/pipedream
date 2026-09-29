import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";
import utils from "./common/utils.mjs";

export default {
  type: "app",
  app: "upload_post",
  propDefinitions: {
    user: {
      type: "string",
      label: "Profile",
      description: "The Upload-Post profile (`username`) whose connected social accounts will be used. [See the documentation](https://docs.upload-post.com/api/user-profiles)",
      async options() {
        const { profiles = [] } = await this.listProfiles();
        return profiles.map(({ username }) => username);
      },
    },
    platforms: {
      type: "string[]",
      label: "Platforms",
      description: "The platform(s) to publish to. Only platforms connected to the selected profile are listed.",
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
      description: "Default title/caption of the post. Platform-specific titles (see **Additional Fields**) override it.",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Optional extended text. Used on LinkedIn commentary, Facebook descriptions, YouTube descriptions, Pinterest notes and TikTok photo descriptions; ignored elsewhere.",
      optional: true,
    },
    scheduledDate: {
      type: "string",
      label: "Scheduled Date",
      description: "ISO-8601 date/time to schedule publishing, e.g. `2026-12-31T23:45:00Z`. Must be in the future (up to 365 days). Omit to publish immediately. Cannot be combined with **Add to Queue**.",
      optional: true,
    },
    timezone: {
      type: "string",
      label: "Timezone",
      description: "IANA timezone identifier (e.g. `Europe/Madrid`, `America/New_York`). If provided, **Scheduled Date** is interpreted in this timezone. Defaults to UTC.",
      optional: true,
    },
    addToQueue: {
      type: "boolean",
      label: "Add to Queue",
      description: "If `true`, the post is scheduled to the next available slot of the profile's queue. Cannot be combined with **Scheduled Date**. [See the documentation](https://docs.upload-post.com/api/queue-system)",
      optional: true,
    },
    asyncUpload: {
      type: "boolean",
      label: "Async Upload",
      description: "If `true`, the request returns immediately with a `request_id` and the upload is processed in the background. Use the **Get Upload Status** action to follow it. Uploads that take longer than 59 seconds switch to async automatically.",
      optional: true,
    },
    firstComment: {
      type: "string",
      label: "First Comment",
      description: "Automatically post a first comment after publishing, on the platforms that support it.",
      optional: true,
    },
    externalId: {
      type: "string",
      label: "External ID",
      description: "Your own identifier for this post (max 255 characters), echoed back by the status, schedule and history endpoints.",
      optional: true,
    },
    facebookPageId: {
      type: "string",
      label: "Facebook Page ID",
      description: "The Facebook Page to publish to. Required when publishing to Facebook, unless the profile has a single Page connected or a pinned Page.",
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
      description: "The Pinterest board to publish to. Required when publishing to Pinterest.",
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
      description: "Post to this LinkedIn organization page instead of the personal profile.",
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
      description: "Any other documented parameter of this endpoint, as `field: value` pairs (e.g. `instagram_title`, `x_first_comment`, `threads_topic_tag`). Array parameters take a JSON array (e.g. `tags`: `[\"news\", \"ai\"]`). See the endpoint documentation linked in the action description for the full list.",
      optional: true,
    },
    requestId: {
      type: "string",
      label: "Request ID",
      description: "The `request_id` returned by an upload (async or not).",
      optional: true,
    },
    jobId: {
      type: "string",
      label: "Job ID",
      description: "The `job_id` returned when scheduling or queueing a post.",
      optional: true,
    },
    scheduledJobId: {
      type: "string",
      label: "Scheduled Post",
      description: "The `job_id` of the scheduled post.",
      async options() {
        const { scheduled_posts: posts = [] } = await this.listScheduledPosts();
        return posts.map(({
          job_id: value, scheduled_date: date, title, profile_username: profile,
        }) => ({
          label: `${date} - ${profile} - ${title || value}`,
          value,
        }));
      },
    },
  },
  methods: {
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
    uploadVideo(opts = {}) {
      return this._postForm({
        path: "/upload",
        ...opts,
      });
    },
    uploadPhotos(opts = {}) {
      return this._postForm({
        path: "/upload_photos",
        ...opts,
      });
    },
    uploadText(opts = {}) {
      return this._postForm({
        path: "/upload_text",
        ...opts,
      });
    },
    getUploadStatus(opts = {}) {
      return this._makeRequest({
        path: "/uploadposts/status",
        ...opts,
      });
    },
    listScheduledPosts(opts = {}) {
      return this._makeRequest({
        path: "/uploadposts/schedule",
        ...opts,
      });
    },
    cancelScheduledPost({
      jobId, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/uploadposts/schedule/${encodeURIComponent(jobId)}`,
        ...opts,
      });
    },
    getUploadHistory(opts = {}) {
      return this._makeRequest({
        path: "/uploadposts/history",
        ...opts,
      });
    },
    listProfiles(opts = {}) {
      return this._makeRequest({
        path: "/uploadposts/users",
        ...opts,
      });
    },
    getAnalytics({
      profileUsername, ...opts
    }) {
      return this._makeRequest({
        path: `/analytics/${encodeURIComponent(profileUsername)}`,
        ...opts,
      });
    },
    listFacebookPages(opts = {}) {
      return this._makeRequest({
        path: "/uploadposts/facebook/pages",
        ...opts,
      });
    },
    listPinterestBoards(opts = {}) {
      return this._makeRequest({
        path: "/uploadposts/pinterest/boards",
        ...opts,
      });
    },
    listLinkedinPages(opts = {}) {
      return this._makeRequest({
        path: "/uploadposts/linkedin/pages",
        ...opts,
      });
    },
  },
};
