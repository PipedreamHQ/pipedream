import axios from "axios";
import parseLinkHeader from "parse-link-header";
import { createHmac } from "crypto";
import utils from "./common/utils.mjs";

export default {
  type: "app",
  app: "sentry",
  propDefinitions: {
    organizationSlug: {
      type: "string",
      label: "Organization",
      description: "The organization for which to consider issues events",
      async options(context) {
        const url = this._organizationsEndpoint();
        const params = {};  // We don't need to provide query parameters at the moment.
        const {
          data,
          next,
        } = await this._propDefinitionsOptions(url, params, context);
        const options = data.map(this._organizationObjectToOption);
        return {
          options,
          context: {
            nextPage: next,
          },
        };
      },
    },
    projectId: {
      type: "string",
      label: "Project",
      description: "The project to perform your action",
      async options() {
        const { data } = await this.listUserProjects();
        return data.map((project) => ({
          label: project.name,
          value: project.slug,
        }));
      },
    },
    issueId: {
      type: "string",
      label: "Issue",
      description: "The issue to be updated",
      async options(context) {
        const {
          organizationSlug,
          projectId,
        } = context;
        const url = `${this._apiUrl()}/projects/${organizationSlug}/${projectId}/issues/`;
        const params = {};
        const {
          data,
          next,
        } = await this._propDefinitionsOptions(url, params, context);
        return {
          options: data.map((issue) => ({
            label: `[${issue.id}] ${issue.title} - ${issue.status}`,
            value: issue.id,
          })),
          context: {
            nextPage: next,
          },
        };
      },
    },
    userId: {
      type: "string",
      label: "User",
      description: "The user to perform your action",
      optional: true,
      async options({ organizationSlug }) {
        const res = await this.listOrganizationUser(organizationSlug);
        return res.data?.map((user) => ({
          label: user.name,
          value: user.user.id,
        }));
      },
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of registers to return. Defaults to `1000`.",
      optional: true,
      max: 10000,
    },
  },
  methods: {
    _apiUrl() {
      return "https://sentry.io/api/0";
    },
    _organizationsEndpoint() {
      const baseUrl = this._apiUrl();
      return `${baseUrl}/organizations/`;
    },
    _integrationsEndpoint(integrationSlug) {
      const baseUrl = this._apiUrl();
      const url = `${baseUrl}/sentry-apps`;
      return integrationSlug
        ? `${url}/${integrationSlug}/`
        : `${url}/`;
    },
    _authToken() {
      return this.$auth.auth_token;
    },
    _makeRequestConfig() {
      const authToken = this._authToken();
      const headers = {
        "Authorization": `Bearer ${authToken}`,
        "User-Agent": "@PipedreamHQ/pipedream v0.1",
      };
      return {
        headers,
      };
    },
    async _paginate(maxResults = 1000, apiRequestFunction, ...params) {
      let data = [];
      let cursor = null;
      do {
        // Here we make the request using the params and the cursor
        const res = await apiRequestFunction(...params, cursor?.cursor);
        cursor = parseLinkHeader(res.headers["link"]).next;

        // Add the results to the data array
        data.push(...res.data);

        // If we reach the maxResults limit, break the loop and slice the array
        if (data.length > maxResults) {
          data = data.slice(0, maxResults);
          break;
        }

        // Break the loop if there are no more results
        if (cursor.results == "false") {
          break;
        }
      } while (true);
      return data;
    },
    _organizationObjectToOption(organization) {
      const {
        name,
        slug,
      } = organization;
      const label = `${name} (${slug})`;
      return {
        label,
        value: slug,
      };
    },
    async _propDefinitionsOptions(
      url,
      params, {
        page,
        prevContext,
      },
    ) {
      let requestConfig = this._makeRequestConfig();  // Basic axios request config
      if (page === 0) {
        // First time the options are being retrieved.
        // Include the parameters provided, which will be persisted
        // across the different pages.
        requestConfig = {
          ...requestConfig,
          params,
        };
      } else if (prevContext.nextPage) {
        // Retrieve next page of options.
        url = prevContext.nextPage.url;
      } else {
        // No more options available.
        return {
          data: [],
        };
      }

      const {
        data,
        headers: { link },
      } = await axios.get(url, requestConfig);
      const { next } = parseLinkHeader(link);

      return {
        data,
        next,
      };
    },
    _baseIntegrationParams() {
      return {
        scopes: [
          "event:read",
        ],
        events: [
          "issue",
        ],
        isAlertable: true,
        isInternal: true,
        verifyInstall: false,
      };
    },
    async createIntegration(eventSourceName, organization, webhookUrl) {
      const url = this._integrationsEndpoint();
      const name = utils.formatIntegrationName(eventSourceName);
      const requestData = {
        ...this._baseIntegrationParams(),
        name,
        organization,
        webhookUrl,
      };
      const requestConfig = this._makeRequestConfig();
      const { data } = await axios.post(url, requestData, requestConfig);
      return data;
    },
    async deleteIntegration(integrationSlug) {
      const url = this._integrationsEndpoint(integrationSlug);
      const requestConfig = this._makeRequestConfig();
      await axios.delete(url, requestConfig);
    },
    async disableIntegration(integrationSlug) {
      const url = this._integrationsEndpoint(integrationSlug);
      const requestConfig = this._makeRequestConfig();
      const requestData = {
        events: null,
        isAlertable: false,
        name: "pipedream (disabled)",
        webhookUrl: null,
      };
      await axios.put(url, requestData, requestConfig);
    },
    async getClientSecret(integrationSlug) {
      const url = this._integrationsEndpoint(integrationSlug);
      const requestConfig = this._makeRequestConfig();
      const { data } = await axios.get(url, requestConfig);
      return data.clientSecret;
    },
    isValidSource(event, clientSecret) {
      const {
        headers: { "sentry-hook-signature": signature },
        bodyRaw,
      } = event;
      const hmac = createHmac("sha256", clientSecret);
      hmac.update(bodyRaw, "utf8");
      const digest = hmac.digest("hex");
      return digest === signature;
    },
    async listUserProjects(cursor) {
      const url = `${this._apiUrl()}/projects/`;
      const requestConfig = this._makeRequestConfig();
      return axios.get(url, {
        ...requestConfig,
        params: {
          cursor,
        },
      });
    },
    async listProjectEvents(organizationSlug, projectSlug, params, cursor) {
      const url = `${this._apiUrl()}/projects/${organizationSlug}/${projectSlug}/events/`;
      const requestConfig = this._makeRequestConfig();
      return axios.get(url, {
        ...requestConfig,
        params: {
          ...params,
          cursor,
        },
      });
    },
    async listProjectIssues(organizationSlug, projectSlug, params, cursor) {
      const url = `${this._apiUrl()}/projects/${organizationSlug}/${projectSlug}/issues/`;
      const requestConfig = this._makeRequestConfig();
      return axios.get(url, {
        ...requestConfig,
        params: {
          ...params,
          cursor,
        },
      });
    },
    async listOrganizationUser(organizationSlug) {
      const url = `${this._apiUrl()}/organizations/${organizationSlug}/users/`;
      const requestConfig = this._makeRequestConfig();
      return axios.get(url, requestConfig);
    },
    async updateIssue(issueId, data) {
      const url = `${this._apiUrl()}/issues/${issueId}/`;
      const requestConfig = this._makeRequestConfig();
      return axios.put(url, data, requestConfig);
    },
  },
};
