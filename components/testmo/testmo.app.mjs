import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "testmo",
  propDefinitions: {
    milestoneId: {
      type: "string",
      label: "Milestone Id",
      description: "ID of the milestone for the new automation run. If both milestone and `milestoneId` are specified, `milestoneId` is given precedence.",
      async options({
        page, projectId,
      }) {
        const { result } = await this.listMilestones({
          projectId,
          params: {
            page: page + 1,
          },
        });

        return result.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    projectId: {
      type: "string",
      label: "Project Id",
      description: "The Id of the target project.",
      async options({ page }) {
        const { result } = await this.listProjects({
          params: {
            page: page + 1,
          },
        });

        return result.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    source: {
      type: "string",
      label: "Source",
      description: "Name of the source for the new automation run. If this source does not already exist in the target project, Testmo automatically creates a new one. It is recommended to keep source names short. Good examples are `backend`, `frontend` or `mobile-iphone`.",
      async options({
        page, projectId,
      }) {
        const { result } = await this.listSources({
          projectId,
          params: {
            page: page + 1,
          },
        });

        return result.map(({ name }) => name);
      },
    },
    automationRunId: {
      type: "string",
      label: "Automation Run Id",
      description: "The Id of the automation run.",
      async options({
        projectId, page,
      }) {
        const { result } = await this.listAutomationRuns({
          projectId,
          params: {
            page: page + 1,
          },
        });

        return result.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    threadId: {
      type: "string",
      label: "Thread Id",
      description: "The Id of the thread of the automation run.",
      async options({ automationRunId }) {
        const { result } = await this.getAutomationRun({
          automationRunId,
        });
        if (!result || !result?.threads) {
          return;
        }
        return result.threads.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    artifacts: {
      type: "string[]",
      label: "Artifacts",
      description: "List of URLs of externally stored test artifacts to link to the thread (such as log files, screenshots or test data)",
      optional: true,
    },
  },
  methods: {
    _apiUrl() {
      return `https://${this.$auth.sitename}.testmo.net/api/v1`;
    },
    _getHeaders() {
      return {
        "Authorization": `Bearer ${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      const config = {
        url: `${this._apiUrl()}/${path}`,
        headers: this._getHeaders(),
        ...opts,
      };

      return axios($, config);
    },
    createAutomationRun({
      projectId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: `projects/${projectId}/automation/runs`,
        ...args,
      });
    },
    listAutomationRuns({
      projectId, ...args
    }) {
      return this._makeRequest({
        path: `projects/${projectId}/automation/runs`,
        ...args,
      });
    },
    listMilestones({
      projectId, ...args
    }) {
      return this._makeRequest({
        path: `projects/${projectId}/milestones`,
        ...args,
      });
    },
    listProjects(args = {}) {
      return this._makeRequest({
        path: "projects",
        ...args,
      });
    },
    listSources({
      projectId, ...args
    }) {
      return this._makeRequest({
        path: `projects/${projectId}/automation/sources`,
        ...args,
      });
    },
    getAutomationRun({
      automationRunId, ...args
    }) {
      return this._makeRequest({
        path: `automation/runs/${automationRunId}`,
        ...args,
      });
    },
    listSessions({
      projectId, ...args
    }) {
      return this._makeRequest({
        path: `projects/${projectId}/sessions`,
        ...args,
      });
    },
    appendToAutomationRun({
      automationRunId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: `automation/runs/${automationRunId}/append`,
        ...args,
      });
    },
    appendToThread({
      threadId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: `automation/runs/threads/${threadId}/append`,
        ...args,
      });
    },
    async *paginate({
      fn, params = {}, maxResults = null, ...args
    }) {
      let hasMore = false;
      let count = 0;
      let page = 0;

      do {
        params.page = ++page;
        const {
          result,
          page: currentPage,
          last_page: lastPage,
        } = await fn({
          params,
          ...args,
        });
        for (const d of result) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasMore = !(currentPage == lastPage);

      } while (hasMore);
    },
  },
};
