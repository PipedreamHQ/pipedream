import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";
import utils from "./common/utils.mjs";

const siteLabel = (site) => (site.name && site.name !== site.domain
  ? `${site.name} (${site.domain})`
  : site.domain);

const withStatus = (item) => `${item.name} (${item.status})`;

const testimonialLabel = (testimonial) => {
  const who = testimonial.person?.name || "Unknown";
  const words = String(testimonial.body || testimonial.title || "").replace(/\s+/g, " ")
    .trim();
  const short = words.length > 60
    ? `${words.slice(0, 57)}...`
    : words;
  return `${who}: ${short} (${testimonial.status})`;
};

export default {
  type: "app",
  app: "privatus_analytics",
  propDefinitions: {
    siteId: {
      type: "string",
      label: "Site",
      description: "The site. Select one, or enter a site ID such as `pa_7Q2K9XH3AB`.",
      async options({ page }) {
        return this.listOptions({
          page,
          path: "/sites.json",
          workspace: true,
          label: siteLabel,
        });
      },
    },
    alertId: {
      type: "string",
      label: "Alert Rule",
      description: "The alert rule. Select one, or enter an alert rule ID such as `alr_3W7L9QK2VD`.",
      async options({ page }) {
        return this.listOptions({
          page,
          path: "/alerts.json",
          workspace: true,
          label: (alert) => alert.name,
        });
      },
    },
    statusPageId: {
      type: "string",
      label: "Status Page",
      description: "The status page. Select one, or enter a status page ID.",
      async options({ page }) {
        return this.listOptions({
          page,
          path: "/status_pages.json",
          workspace: true,
          label: (statusPage) => statusPage.name,
        });
      },
    },
    uptimeCheckId: {
      type: "string",
      label: "Uptime Check",
      description: "The uptime check. Select a **Site** first, then one of its checks, or enter an ID such as `upc_4M8X2TQ7LB`.",
      async options({
        page, siteId,
      }) {
        if (!siteId) return [];
        return this.listOptions({
          page,
          path: `/sites/${utils.segment(siteId)}/uptime.json`,
          label: withStatus,
        });
      },
    },
    experimentId: {
      type: "string",
      label: "Experiment",
      description: "The experiment. Select a **Site** first, then one of its experiments, or enter an ID.",
      async options({
        page, siteId,
      }) {
        if (!siteId) return [];
        return this.listOptions({
          page,
          path: `/sites/${utils.segment(siteId)}/experiments.json`,
          label: withStatus,
        });
      },
    },
    testimonialId: {
      type: "string",
      label: "Testimonial",
      description: "The testimonial. Select a **Site** first. The list shows the newest ones, so enter an ID such as `tm_4TXN8R2KQ7` for an older one.",
      async options({
        page, siteId,
      }) {
        if (!siteId) return [];
        return this.listOptions({
          page,
          path: `/sites/${utils.segment(siteId)}/testimonials.json`,
          params: {
            sort: "added_desc",
          },
          label: testimonialLabel,
        });
      },
    },
    testimonialRequestId: {
      type: "string",
      label: "Testimonial Request",
      description: "The testimonial request. Select a **Site** first, then one of its requests, or enter an ID such as `req_6H2N9WK4TD`.",
      async options({
        page, siteId,
      }) {
        if (!siteId) return [];
        return this.listOptions({
          page,
          path: `/sites/${utils.segment(siteId)}/testimonials/requests.json`,
          label: withStatus,
        });
      },
    },
    testimonialFormId: {
      type: "string",
      label: "Testimonial Form",
      description: "The testimonial form. Select a **Site** first, or enter a form ID such as `frm_3C8V5ZP2RN`.",
      async options({
        page, siteId,
      }) {
        if (!siteId) return [];
        return this.listOptions({
          page,
          path: `/sites/${utils.segment(siteId)}/testimonials/forms.json`,
          label: (form) => form.name,
        });
      },
    },
    testimonialFormIds: {
      type: "string[]",
      label: "Testimonial Forms",
      description: "Only testimonials that came through these forms. Select a **Site** first.",
      optional: true,
      async options({
        page, siteId,
      }) {
        if (!siteId) return [];
        return this.listOptions({
          page,
          path: `/sites/${utils.segment(siteId)}/testimonials/forms.json`,
          label: (form) => form.name,
        });
      },
    },
    testimonialTagIds: {
      type: "string[]",
      label: "Tags",
      description: "Only testimonials with one of these tags. Select a **Site** first.",
      optional: true,
      async options({
        page, siteId,
      }) {
        if (!siteId) return [];
        return this.listOptions({
          page,
          path: `/sites/${utils.segment(siteId)}/testimonials/tags.json`,
          label: (tag) => tag.name,
        });
      },
    },
    testimonialCollectionIds: {
      type: "string[]",
      label: "Collections",
      description: "Manual collections to add the testimonial to. Select a **Site** first.",
      optional: true,
      async options({
        page, siteId,
      }) {
        if (!siteId) return [];
        return this.listOptions({
          page,
          path: `/sites/${utils.segment(siteId)}/testimonials/collections.json`,
          label: (collection) => collection.name,
        });
      },
    },
    segmentId: {
      type: "string",
      label: "Segment",
      description: "A saved segment of the site. Its filters are added to the filters. Select a **Site** first.",
      optional: true,
      async options({
        page, siteId,
      }) {
        if (!siteId) return [];
        return this.listOptions({
          page,
          path: `/sites/${utils.segment(siteId)}/segments.json`,
          label: (segment) => segment.name,
        });
      },
    },
    period: {
      type: "string",
      label: "Period",
      description: "The date range, in the time zone of the site. Choose **Custom** and fill in **From** and **To** for other dates.",
      options: constants.PERIOD_OPTIONS,
      default: "7d",
    },
    from: {
      type: "string",
      label: "From",
      description: "The first day of a custom period, as `YYYY-MM-DD`.",
      optional: true,
    },
    to: {
      type: "string",
      label: "To",
      description: "The last day of a custom period, included, as `YYYY-MM-DD`.",
      optional: true,
    },
    filters: {
      type: "string",
      label: "Filters",
      description: "Conditions that must all match, as a JSON list of `[dimension, operator, value]`, for example `[[\"country\",\"is\",\"US\"],[\"page\",\"starts_with\",\"/blog\"]]`. See the [filters documentation](https://privatusanalytics.com/docs/api/filters).",
      optional: true,
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The most items to return. Pages of 100 are read until there are enough.",
      default: constants.DEFAULT_MAX_RESULTS,
      min: 1,
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return constants.BASE_URL;
    },
    _headers() {
      return {
        "Authorization": `Bearer ${this.$auth.api_token}`,
        "Accept": "application/json",
      };
    },
    /**
     * Sends one request to the API with the token of the connected account.
     * @param {object} opts
     * @param {object} [opts.$=this] - The step context, for error details.
     * @param {string} opts.path - The path on the API host, like `/sites/pa_X.json`.
     * @returns {Promise<object>} The response body.
     */
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...opts,
      });
    },
    /**
     * Calls the API and returns the `data` member of the response envelope.
     * @param {object} opts
     * @param {string} [opts.method=GET] - The HTTP method.
     * @param {string} opts.path - The path, like `/sites/pa_X/goals.json`.
     * @param {object} [opts.params] - Query parameters (lists go as `key[]=a`).
     * @param {object} [opts.data] - The JSON body.
     * @returns {Promise<*>} The data of the response, or `null` for an empty one.
     */
    async request({
      $ = this, method = "GET", path, params, data, ...opts
    }) {
      const query = params
        ? utils.queryString(params)
        : "";
      const response = await this._makeRequest({
        $,
        method,
        path: query
          ? `${path}?${query}`
          : path,
        data,
        ...opts,
      });
      if (response && typeof response === "object" && "data" in response) return response.data;
      return response ?? null;
    },
    /**
     * The workspace of the connected API token. A token belongs to one
     * workspace and `GET /workspaces.json` lists only that one.
     * @returns {Promise<string>} The workspace ID.
     */
    async getWorkspaceId({ $ = this } = {}) {
      const workspaces = await this.request({
        $,
        path: "/workspaces.json",
      });
      const workspace = workspaces?.[0];
      if (!workspace) throw new Error("This API token cannot see any workspace.");
      return workspace.id;
    },
    async workspacePath({
      $ = this, path,
    }) {
      return `/workspaces/${utils.segment(await this.getWorkspaceId({
        $,
      }))}${path}`;
    },
    /**
     * One page of a list as `{ label, value }` options.
     * @param {object} opts
     * @param {number} [opts.page=0] - The page, starting at 0, as Pipedream counts it.
     * @param {string} opts.path - The list path.
     * @param {boolean} [opts.workspace=false] - Whether the path is below the workspace.
     * @param {object} [opts.params] - More query parameters.
     * @param {Function} opts.label - Makes the label of an item.
     */
    async listOptions({
      page = 0, path, workspace = false, params = {}, label,
    }) {
      const fullPath = workspace
        ? await this.workspacePath({
          path,
        })
        : path;
      const items = await this.request({
        path: fullPath,
        params: {
          ...params,
          page: page + 1,
          per_page: constants.PER_PAGE,
        },
      });
      return (items || []).map((item) => ({
        label: label(item),
        value: item.id,
      }));
    },
    /**
     * Reads the pages of a list until there are `maxResults` items or no more.
     * @param {object} opts
     * @param {string} opts.path - The list path.
     * @param {object} [opts.params] - Query parameters.
     * @param {number} [opts.maxResults=100] - The most items to return.
     * @returns {Promise<object[]>} The items.
     */
    async paginate({
      $ = this, path, params = {}, maxResults = constants.DEFAULT_MAX_RESULTS,
    }) {
      const items = [];
      for (let page = 1; page <= 200; page++) {
        const response = await this._makeRequest({
          $,
          path: `${path}?${utils.queryString({
            ...params,
            page,
            per_page: constants.PER_PAGE,
          })}`,
        });
        const rows = Array.isArray(response?.data)
          ? response.data
          : [];
        items.push(...rows);
        const totalPages = Number(response?.meta?.total_pages || 0);
        const done = items.length >= maxResults || rows.length === 0;
        if (done || !totalPages || page >= totalPages) break;
      }
      return items.slice(0, maxResults);
    },
    /**
     * Creates a webhook in the workspace of the token.
     * @param {object} opts
     * @param {string} opts.workspaceId - The workspace ID.
     * @param {object} opts.data - `{ url, events, enabled }`.
     * @returns {Promise<object>} The webhook, with its signing `secret`.
     */
    createWebhook({
      $ = this, workspaceId, data,
    }) {
      return this.request({
        $,
        method: "POST",
        path: `/workspaces/${utils.segment(workspaceId)}/webhooks.json`,
        data,
      });
    },
    /**
     * Deletes a webhook. One that is already gone is not an error.
     */
    async deleteWebhook({
      $ = this, workspaceId, webhookId,
    }) {
      try {
        await this._makeRequest({
          $,
          method: "DELETE",
          path: `/workspaces/${utils.segment(workspaceId)}/webhooks/${utils.segment(webhookId)}.json`,
        });
      } catch (err) {
        if (err?.response?.status === 404) return;
        throw err;
      }
    },
  },
};
