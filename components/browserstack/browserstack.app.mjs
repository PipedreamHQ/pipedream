import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "browserstack",
  propDefinitions: {
    browser: {
      type: "string",
      label: "Browser",
      description: "The version of the browser to use",
      async options() {
        const browsers = await this.listBrowsers();

        return browsers.map((browser) => ({
          label: `${browser.os} ${browser.os_version} - ${browser.browser} ${browser.browser_version || ""}`,
          value: JSON.stringify(browser),
        }));
      },
    },
    projectId: {
      type: "string",
      label: "Project ID",
      description: "The ID of the project",
      async options({ page }) {
        const { projects } = await this.listProjects({
          params: {
            p: page + 1,
          },
        });

        return projects.map((project) => ({
          label: project.name,
          value: project.id,
        }));
      },
    },
  },
  methods: {
    _baseUrl(baseUrl = "https://api-automation.browserstack.com/ext/v1") {
      return baseUrl;
    },
    _getAuth() {
      return {
        username: this.$auth.user_name,
        password: this.$auth.access_key,
      };
    },
    _getHeaders(headers = {}) {
      return {
        "Content-Type": "application/json",
        "Accept": "application/json",
        ...headers,
      };
    },
    _makeRequest({
      $ = this, path, baseUrl, headers, ...opts
    } = {}) {
      return axios($, {
        url: `${this._baseUrl(baseUrl)}${path}`,
        headers: this._getHeaders(headers),
        auth: this._getAuth(),
        ...opts,
      });
    },
    listBrowsers(opts = {}) {
      return this._makeRequest({
        baseUrl: "https://api.browserstack.com",
        path: "/screenshots/browsers.json",
        ...opts,
      });
    },
    createScreenshotJob(opts = {}) {
      return this._makeRequest({
        baseUrl: "https://www.browserstack.com",
        method: "POST",
        path: "/screenshots",
        ...opts,
      });
    },
    listProjects(opts = {}) {
      return this._makeRequest({
        path: "/projects",
        ...opts,
      });
    },
    listBuilds({
      projectId, ...opts
    }) {
      return this._makeRequest({
        path: `/projects/${projectId}/builds`,
        ...opts,
      });
    },
    async *paginate({
      fn, params = {}, maxResults = null, ...opts
    }) {
      let count = 0;
      let nextPage;

      do {
        params.next_page = nextPage;
        const {
          builds, pagination,
        } = await fn({
          params,
          ...opts,
        });
        for (const d of builds) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        nextPage = pagination.next_page;

      } while (nextPage);
    },
  },
};
