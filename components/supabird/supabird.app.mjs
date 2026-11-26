import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";
import utils from "./common/utils.mjs";

export default {
  type: "app",
  app: "supabird",
  propDefinitions: {
    socialSet: {
      type: "string",
      label: "Social Set",
      description: "The social set (one brand with its own X account and connected networks) to use, e.g. `6af6f28f3d61850002518bfe`. Use **List Social Sets** to find it (the `id` field). Leave empty if your account has a single social set.",
      optional: true,
      async options() {
        const { data = [] } = await this.listSocialSets();
        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    postId: {
      type: "string",
      label: "Post",
      description: "The ID of the post, e.g. `6afe0717f47f2d00029cd71e`. Use the `id` returned by **Create Post**, or select one of your scheduled posts. IDs of published posts come from the **New Published Post** source.",
      async options({ prevContext }) {
        const {
          data = [], has_more: hasMore, next_cursor: cursor,
        } = await this.listScheduledPosts({
          params: {
            limit: constants.OPTIONS_PAGE_LIMIT,
            cursor: prevContext?.cursor,
          },
        });
        const options = data.map(({
          id: value, text, scheduled_at: scheduledAt,
        }) => ({
          label: `${utils.truncate(text, 50)} (${scheduledAt})`,
          value,
        }));
        return hasMore && cursor
          ? {
            options,
            context: {
              cursor,
            },
          }
          : {
            options,
          };
      },
    },
  },
  methods: {
    _baseUrl() {
      return constants.BASE_URL;
    },
    _headers(headers = {}) {
      return {
        "Authorization": `Bearer ${this.$auth.api_key}`,
        "Content-Type": "application/json",
        ...headers,
      };
    },
    /**
     * Send a request to the SupaBird API. Retries once on HTTP 429 after the
     * number of seconds in the `Retry-After` header and explains HTTP 402.
     * @param {object} args - Request options.
     * @param {object} [args.$] - The Pipedream step context.
     * @param {string} args.path - The API path, e.g. `/posts`.
     * @param {boolean} [args.retried] - Internal flag, set after the retry.
     * @returns {Promise<object>} The parsed response body.
     */
    async _makeRequest({
      $ = this, path, headers, retried = false, ...args
    }) {
      try {
        return await axios($, {
          baseURL: this._baseUrl(),
          url: path,
          headers: this._headers(headers),
          ...args,
        });
      } catch (err) {
        const status = err.response?.status;
        if (status === 429 && !retried) {
          const retryAfter = Number(err.response?.headers?.["retry-after"]) || 5;
          await utils.sleep(Math.min(retryAfter, constants.MAX_RETRY_AFTER_SECONDS) * 1000);
          return this._makeRequest({
            $,
            path,
            headers,
            retried: true,
            ...args,
          });
        }
        if (status === 402) {
          throw new Error(
            "SupaBird Pro or trial plan needed. "
            + (err.response?.data?.message ?? "Upgrade your plan to use the SupaBird API."),
          );
        }
        throw err;
      }
    },
    /**
     * Get the account behind the API key.
     * @returns {Promise<object>} `{ name, x_username, plan, handles, social_sets_count, auth }`
     */
    getMe(opts = {}) {
      return this._makeRequest({
        path: "/me",
        ...opts,
      });
    },
    listSocialSets(opts = {}) {
      return this._makeRequest({
        path: "/social-sets",
        ...opts,
      });
    },
    listScheduledPosts(opts = {}) {
      return this._makeRequest({
        path: "/posts/scheduled",
        ...opts,
      });
    },
    listPublishedPosts(opts = {}) {
      return this._makeRequest({
        path: "/posts/published",
        ...opts,
      });
    },
    listDrafts(opts = {}) {
      return this._makeRequest({
        path: "/drafts",
        ...opts,
      });
    },
    listSavedPosts(opts = {}) {
      return this._makeRequest({
        path: "/saved-posts",
        ...opts,
      });
    },
    getPost({
      postId, ...opts
    }) {
      return this._makeRequest({
        path: `/posts/${encodeURIComponent(postId)}`,
        ...opts,
      });
    },
    createPost(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/posts",
        ...opts,
      });
    },
    unschedulePost({
      postId, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/posts/${encodeURIComponent(postId)}`,
        ...opts,
      });
    },
    generateIdeas(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/ideas",
        ...opts,
      });
    },
    getJob({
      jobId, ...opts
    }) {
      return this._makeRequest({
        path: `/jobs/${encodeURIComponent(jobId)}`,
        ...opts,
      });
    },
    createPostingSlot(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/posting-slots",
        ...opts,
      });
    },
    /**
     * Poll a background job until it completes.
     * @param {object} args - Options.
     * @param {object} [args.$] - The Pipedream step context.
     * @param {string} args.jobId - The job ID returned with an HTTP 202.
     * @param {number} args.timeoutMs - How long to wait before giving up.
     * @param {number} [args.intervalMs] - Delay between polls.
     * @returns {Promise<object>} The completed job.
     */
    async waitForJob({
      $, jobId, timeoutMs, intervalMs = constants.JOB_POLL_INTERVAL_MS,
    }) {
      const deadline = Date.now() + timeoutMs;
      while (true) {
        const job = await this.getJob({
          $,
          jobId,
        });
        if (job.status === "completed") {
          return job;
        }
        if (job.status === "failed") {
          throw new Error(
            `SupaBird job ${jobId} failed: ${job.error ?? job.result?.message ?? "unknown error"}`,
          );
        }
        if (Date.now() + intervalMs > deadline) {
          throw new Error(
            `SupaBird job ${jobId} is still running after ${timeoutMs / 1000} seconds. It is kept for 1 hour on SupaBird's side.`,
          );
        }
        await utils.sleep(intervalMs);
      }
    },
    /**
     * Iterate over every item of a cursor-paginated SupaBird list, newest first.
     * @param {object} args - Options.
     * @param {Function} args.fn - The list method, e.g. `this.listDrafts`.
     * @param {object} [args.args] - Request options passed to `fn`, incl. `params`.
     * @param {number} [args.max] - Stop after this many items.
     * @yields {object} One item of the `data` array per iteration.
     */
    async *paginate({
      fn, args = {}, max,
    }) {
      let cursor;
      let count = 0;
      do {
        const {
          data = [], has_more: hasMore, next_cursor: nextCursor,
        } = await fn.call(this, {
          ...args,
          params: {
            limit: constants.PAGE_LIMIT,
            ...args.params,
            cursor,
          },
        });
        for (const item of data) {
          yield item;
          if (max && ++count >= max) {
            return;
          }
        }
        cursor = hasMore
          ? nextCursor
          : null;
      } while (cursor);
    },
    async getPaginatedResources(opts = {}) {
      const results = [];
      for await (const item of this.paginate(opts)) {
        results.push(item);
      }
      return results;
    },
  },
};
