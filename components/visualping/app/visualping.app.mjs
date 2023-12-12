import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "visualping",
  propDefinitions: {
    active: {
      type: "boolean",
      label: "Active",
      description: "Whether the job is active or paused.",
    },
    adCampaign: {
      type: "object",
      label: "Ad Campaign",
      description: "For internal use.",
    },
    advancedScheduleActive: {
      type: "boolean",
      label: "Advanced Schedule Active",
      description: "Whether advanced schedule is active or not.",
    },
    business: {
      type: "boolean",
      label: "Business",
      description: "For internal use.",
    },
    contentType: {
      type: "string",
      label: "Content Type",
      description: "For internal use.",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Job Description",
    },
    disableJS: {
      type: "boolean",
      label: "Disable JS",
      description: "For internal use.",
    },
    email: {
      type: "string",
      label: "Email",
      description: "An email for internal use.",
    },
    enableEmailAlert: {
      type: "boolean",
      label: "Enable Email Alert",
      description: "Used to enable email notifications for the considered job. Typically false.",
    },
    enableSmsAlert: {
      type: "boolean",
      label: "Enable SMS Alert",
      description: "Used to enable sms notifications for the considered job. Typically false.",
    },
    fixedProxyAlias: {
      type: "string",
      label: "Fixed Proxy Alias",
      description: "For internal use.",
    },
    interval: {
      type: "string",
      label: "Interval",
      description: "Job's crawling interval expressed in minutes. Examples: `5`, `15`, `1440`...",
    },
    jobId: {
      label: "Job ID",
      description: "The job ID",
      type: "string",
      async options({
        workspaceId, page,
      }) {
        const { jobs } = await this.findJobs({
          params: {
            workspaceId,
            pageIndex: page,
            pageSize: 10,
          },
        });

        return jobs.map(({
          id, description, url,
        }) => ({
          value: id,
          label: `${description} (${url})`,
        }));
      },
    },
    locale: {
      type: "string",
      label: "Locale",
      description: "Locale for internal use.",
    },
    mode: {
      type: "string",
      label: "Mode",
      description: "Job mode",
      options: [
        "TEXT",
        "VISUAL",
        "WEB",
      ],
    },
    multicheckEnabled: {
      type: "string",
      label: "Multicheck Enabled",
      description: "For internal use.",
    },
    origin: {
      type: "string",
      label: "Origin",
      description: "For internal use.",
    },
    organisationId: {
      type: "string",
      label: "Organisation Id",
      description: "Unique ID of the organisation.",
    },
    pageHeight: {
      type: "string",
      label: "Page Height",
      description: "For internal use.",
    },
    preactionsActive: {
      type: "boolean",
      label: "Preactions Active",
      description: "Whether Preactions is active or not.",
    },
    preactionsObjects: {
      type: "any",
      label: "Preactions Objects",
      description: "Array of `LegacyJobPreAction` objects.",
    },
    proxy: {
      type: "string",
      label: "Proxy",
      description: "String code representing the optional proxy to use for this job. Contact [Visualping](https://visualping.io/contact/) for details.",
    },
    renderer: {
      type: "string",
      label: "Renderer",
      description: "For internal use.",
    },
    siteReferer: {
      type: "string",
      label: "Site Referer",
      description: "Site Referer for internal use.",
    },
    targetDevice: {
      type: "string",
      label: "Target Device",
      description: "1 for regular desktop crawling of a specific area (used typically in conjunction with a crop area), 4 for full page desktop crawling (mostly used with text jobs), 3 for desktop crawling with special fold extractions. 2 for mobile.",
      options: [
        {
          label: "1 - Area",
          value: "1",
        },
        {
          label: "2 - Mobile",
          value: "2",
        },
        {
          label: "3 - Specific Fold",
          value: "3",
        },
        {
          label: "4 - All Page",
          value: "4",
        },
      ],
    },
    trigger: {
      type: "string",
      label: "Trigger",
      description: "Job's diff detection trigger expressed in percents. Examples: `0.1`, `25`...",
    },
    url: {
      type: "string",
      label: "URL",
      description: "Url of the web page monitored by this job.",
    },
    useDiscordNotification: {
      type: "boolean",
      label: "Use Discord Notification",
      description: "If this job uses discord notification.",
    },
    useSlackAppNotification: {
      type: "boolean",
      label: "Use Slack App Notification",
      description: "If this job uses slack app notification.",
    },
    useSlackNotification: {
      type: "boolean",
      label: "Use Slack Notification",
      description: "If this job uses slack notification.",
    },
    useTeamsNotification: {
      type: "boolean",
      label: "Use Teams Notification",
      description: "If this job uses teams notification.",
    },
    useWebhookNotification: {
      type: "boolean",
      label: "Use Webhook Notification",
      description: "If this job uses webhook notification.",
    },
    waitTime: {
      type: "integer",
      label: "Wait Time",
      description: "Number of seconds to wait the crawling and before applying any actions on the wab page.",
    },
    workspaceId: {
      label: "Workspace ID",
      description: "The workspace ID",
      type: "string",
      async options() {
        const { workspaces } = await this.getUserDetails();

        return workspaces.map((workspace) => ({
          value: `${workspace.id}`,
          label: workspace.name,
        }));
      },
    },
    xpath: {
      type: "string",
      label: "Xpath",
      description: "Optional xpath representing the root web element to consider for this job.",
    },
  },
  methods: {
    _accessToken() {
      return this.$auth.oauth_access_token;
    },
    _apiUrl(sub) {
      return `https://${sub}.api.visualping.io`;
    },
    _makeRequest({
      $ = this, sub = "job", path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl(sub)}${path}`,
        headers: {
          Authorization: `Bearer ${this._accessToken()}`,
        },
        ...args,
      });
    },
    getUserDetails(args = {}) {
      return this._makeRequest({
        sub: "account",
        path: "/describe-user",
        ...args,
      });
    },
    findJobs(args = {}) {
      return this._makeRequest({
        path: "/v2/jobs",
        ...args,
      });
    },
    getJob({
      workspaceId, jobId, ...args
    }) {
      return this._makeRequest({
        path: `/v2/jobs/${jobId}`,
        ...args,
        params: {
          workspaceId,
          ...args.params,
        },
      });
    },
    createJob(args = {}) {
      return this._makeRequest({
        path: "/v2/jobs",
        method: "POST",
        ...args,
      });
    },
    updateJob({
      jobId, ...args
    }) {
      return this._makeRequest({
        path: `/v2/jobs/${jobId}`,
        method: "PUT",
        ...args,
      });
    },
    deleteJob({
      jobId, workspaceId,
    }) {
      return this._makeRequest({
        path: `/v2/jobs/${jobId}`,
        method: "DELETE",
        params: {
          workspaceId,
        },
      });
    },
    async *paginate({
      fn, params = {}, maxResults = null,
    }) {
      let lastPage = false;
      let count = 0;
      let page = 0;

      do {
        params.pageIndex = page++;
        const {
          jobs,
          totalPages,
          pageIndex,
        } = await fn({
          params,
        });
        for (const j of jobs) {
          yield j;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        lastPage = (totalPages != pageIndex);

      } while (lastPage);
    },
  },
};
