import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";
import utils from "./common/utils.mjs";

export default {
  type: "app",
  app: "privatus_analytics",
  propDefinitions: {
    siteId: {
      type: "string",
      label: "Site",
      description: "The site. Use **Find Site** to get the site ID (the `id` field), e.g. `pa_7Q2K9XH3AB`.",
      async options({ page }) {
        return this.listSiteOptions({
          page,
        });
      },
    },
    siteIds: {
      type: "string[]",
      label: "Sites",
      description: "The sites, as a list of site IDs. Use **Find Site** to get the site IDs (the `id` field), e.g. `[\"pa_7Q2K9XH3AB\"]`.",
      optional: true,
      async options({ page }) {
        return this.listSiteOptions({
          page,
        });
      },
    },
    alertId: {
      type: "string",
      label: "Alert Rule",
      description: "The alert rule. Use **Find Alert Rules** to get the alert rule ID (the `id` field), e.g. `alr_3W7L9QK2VD`.",
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
      description: "The status page. Use **Find Status Pages** to get the status page ID (the `id` field), e.g. `sp_4N7H2XQ9RT`.",
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
      description: "The uptime check of the **Site**. Use **Find Uptime Checks** to get the uptime check ID (the `id` field), e.g. `upc_4M8X2TQ7LB`.",
      async options({
        page, siteId,
      }) {
        if (!siteId) return [];
        return this.listOptions({
          page,
          path: `/sites/${utils.segment(siteId)}/uptime.json`,
          label: utils.withStatus,
        });
      },
    },
    experimentId: {
      type: "string",
      label: "Experiment",
      description: "The experiment of the **Site**. Use **Find Experiments** to get the experiment ID (the `id` field), e.g. `exp_8D3K6VQ9ZN`.",
      async options({
        page, siteId,
      }) {
        if (!siteId) return [];
        return this.listOptions({
          page,
          path: `/sites/${utils.segment(siteId)}/experiments.json`,
          label: utils.withStatus,
        });
      },
    },
    testimonialId: {
      type: "string",
      label: "Testimonial",
      description: "The testimonial of the **Site**. Use **Find Testimonials** to get the testimonial ID (the `id` field), e.g. `tm_4TXN8R2KQ7`. The options show only the newest testimonials.",
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
          label: utils.testimonialLabel,
        });
      },
    },
    testimonialRequestId: {
      type: "string",
      label: "Testimonial Request",
      description: "The testimonial request of the **Site**. Use **Find Testimonial Requests** to get the request ID (the `id` field), e.g. `req_5V9C2XM7TL`.",
      async options({
        page, siteId,
      }) {
        if (!siteId) return [];
        return this.listOptions({
          page,
          path: `/sites/${utils.segment(siteId)}/testimonials/requests.json`,
          label: utils.withStatus,
        });
      },
    },
    testimonialFormId: {
      type: "string",
      label: "Testimonial Form",
      description: "The testimonial form of the **Site**. Use **Find Testimonial Forms** to get the form ID (the `id` field), e.g. `frm_3C8V5ZP2RN`.",
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
      description: "Only testimonials that came through these forms of the **Site**. Use **Find Testimonial Forms** to get the form IDs (the `id` fields), e.g. `[\"frm_3C8V5ZP2RN\"]`.",
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
      description: "Only testimonials with one of these tags of the **Site**. Use **Find Testimonial Tags** to get the tag IDs (the `id` fields), e.g. `[\"tag_6B2N4QW8LD\"]`.",
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
      description: "Manual collections of the **Site** to add the testimonial to. Use **Find Testimonial Collections** to get the collection IDs (the `id` fields), e.g. `[\"col_9F4T1KX7MH\"]`.",
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
      description: "A saved segment of the **Site**, whose filters are added to the filters. Use **Find Segments** to get the segment ID (the `id` field), e.g. `seg_6K3D8WM2VP`.",
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
    minRating: {
      type: "string",
      label: "Minimum Rating",
      description: "Only testimonials with at least this many stars, e.g. `4`.",
      options: [
        "1",
        "2",
        "3",
        "4",
        "5",
      ],
      optional: true,
    },
    chartNoteTitle: {
      type: "string",
      label: "Title",
      description: "Short title shown on the chart, e.g. `Launched the new pricing page`.",
    },
    chartNoteDate: {
      type: "string",
      label: "Date",
      description: "The day the note is shown on, as `YYYY-MM-DD` in the time zone of the site, e.g. `2026-10-20`. Defaults to today.",
      optional: true,
    },
    chartNoteEndDate: {
      type: "string",
      label: "End Date",
      description: "For a note that covers several days, the last day, as `YYYY-MM-DD`, e.g. `2026-10-22`.",
      optional: true,
    },
    chartNoteBody: {
      type: "string",
      label: "Body",
      description: "Longer details as plain text, e.g. `Rolled out to all visitors at 14:00 UTC`.",
      optional: true,
    },
    chartNoteUrl: {
      type: "string",
      label: "Link",
      description: "A link such as a pull request or changelog page, e.g. `https://example.com/changelog/2-4-0`.",
      optional: true,
    },
    chartNoteColor: {
      type: "string",
      label: "Color",
      description: "Pin color, e.g. `blue`. Defaults to `neutral` (`blue` for deploy notes).",
      options: constants.CHART_NOTE_COLORS,
      optional: true,
    },
    chartNoteSource: {
      type: "string",
      label: "Source",
      description: "`manual` (default) for notes written by a person, or `deploy` for release notifications. `system`, `import` and `incident` are reserved for notes the app writes itself.",
      options: constants.CHART_NOTE_SOURCES,
      default: "manual",
      optional: true,
    },
    chartNoteVersion: {
      type: "string",
      label: "Version",
      description: "Only used when **Source** is `deploy` and **Title** is empty. A release version or commit, e.g. `v2.4.0`, used to build the default title.",
      optional: true,
    },
    period: {
      type: "string",
      label: "Period",
      description: "The date range, in the time zone of the site, e.g. `30d`. Choose `custom` and fill in **From** and **To** for other dates.",
      options: constants.PERIOD_OPTIONS,
      default: "7d",
    },
    from: {
      type: "string",
      label: "From",
      description: "The first day of a custom period, as `YYYY-MM-DD`, e.g. `2026-10-01`.",
      optional: true,
    },
    to: {
      type: "string",
      label: "To",
      description: "The last day of a custom period, included, as `YYYY-MM-DD`, e.g. `2026-10-31`.",
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
      description: "The most items to return, e.g. `50`. Pages of 100 are read until there are enough.",
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
     * Sends a request to any endpoint of the API. Only a path on the API host is
     * accepted, so the token is never sent anywhere else.
     * @param {object} opts
     * @param {string} [opts.method=GET] - The HTTP method.
     * @param {string} opts.path - The path, like `/sites/pa_X/goals` (`.json` is added).
     * @param {object} [opts.query] - Query parameters.
     * @param {object} [opts.data] - The JSON body, ignored for `GET`.
     * @returns {Promise<object>} The response body.
     */
    sendCustomRequest({
      $ = this, method = "GET", path, query, data,
    }) {
      const [
        base,
        existing,
      ] = utils.apiPath(path).split("?");
      const extra = query
        ? utils.queryString(query)
        : "";
      const search = [
        existing,
        extra,
      ].filter(Boolean)
        .join("&");
      return this._makeRequest({
        $,
        method,
        path: search
          ? `${base}?${search}`
          : base,
        data: method === "GET"
          ? undefined
          : data,
      });
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
     * One page of the sites of the workspace as `{ label, value }` options.
     * @param {object} opts
     * @param {number} [opts.page=0] - The page, starting at 0, as Pipedream counts it.
     */
    listSiteOptions({ page = 0 } = {}) {
      return this.listOptions({
        page,
        path: "/sites.json",
        workspace: true,
        label: utils.siteLabel,
      });
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
