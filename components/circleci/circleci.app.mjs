import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "circleci",
  propDefinitions: {
    pipelineId: {
      type: "string",
      label: "Pipeline ID",
      description: "The identifier of a pipeline",
      async options({
        projectSlug, prevContext,
      }) {
        const {
          items, nextPageToken,
        } = await this.listPipelines({
          projectSlug,
          params: prevContext?.next
            ? {
              "page-token": prevContext.next,
            }
            : {},
        });
        return {
          options: items?.map(({ id }) => id) || [],
          context: {
            next: nextPageToken,
          },
        };
      },
    },
    workflowId: {
      type: "string",
      label: "Workflow ID",
      description: "The identifier of a workflow",
      async options({
        pipelineId, prevContext,
      }) {
        const {
          items, nextPageToken,
        } = await this.listPipelineWorkflows({
          pipelineId,
          params: prevContext?.next
            ? {
              "page-token": prevContext.next,
            }
            : {},
        });
        return {
          options: items?.map(({
            id: value, name: label,
          }) => ({
            value,
            label,
          })) || [],
          context: {
            next: nextPageToken,
          },
        };
      },
    },
    jobNumber: {
      type: "string",
      label: "Job Number",
      description: "The job number of a job",
      async options({
        workflowId, prevContext,
      }) {
        const {
          items, nextPageToken,
        } = await this.listWorkflowJobs({
          workflowId,
          params: prevContext?.next
            ? {
              "page-token": prevContext.next,
            }
            : {},
        });
        return {
          options: items?.map(({
            job_number: value, name: label,
          }) => ({
            value,
            label,
          })) || [],
          context: {
            next: nextPageToken,
          },
        };
      },
    },
    jobIds: {
      type: "string[]",
      label: "Jobs",
      description: "A list of job IDs to rerun",
      optional: true,
      async options({
        workflowId, prevContext,
      }) {
        const {
          items, nextPageToken,
        } = await this.listWorkflowJobs({
          workflowId,
          params: prevContext?.next
            ? {
              "page-token": prevContext.next,
            }
            : {},
        });
        return {
          options: items?.map(({
            id: value, name: label,
          }) => ({
            value,
            label,
          })) || [],
          context: {
            next: nextPageToken,
          },
        };
      },
    },
    projectSlug: {
      type: "string",
      label: "Project Slug",
      description: "Project slug in the form `vcs-slug/org-name/repo-name` (found in Project Settings)",
    },
  },
  methods: {
    _baseUrl() {
      return "https://circleci.com/api/v2";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        ...otherOpts
      } = opts;
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          "Circle-Token": this.$auth.token,
        },
        ...otherOpts,
      });
    },
    createWebhook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/webhook",
        ...opts,
      });
    },
    deleteWebhook(webhookId) {
      return this._makeRequest({
        method: "DELETE",
        path: `/webhook/${webhookId}`,
      });
    },
    listPipelines({
      projectSlug, ...opts
    }) {
      return this._makeRequest({
        path: `/project/${projectSlug}/pipeline/mine`,
        ...opts,
      });
    },
    listPipelineWorkflows({
      pipelineId, ...opts
    }) {
      return this._makeRequest({
        path: `/pipeline/${pipelineId}/workflow`,
        ...opts,
      });
    },
    listWorkflowJobs({
      workflowId, ...opts
    }) {
      return this._makeRequest({
        path: `/workflow/${workflowId}/job`,
        ...opts,
      });
    },
    triggerPipeline({
      projectSlug, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/project/${projectSlug}/pipeline/run`,
        ...opts,
      });
    },
    getJobArtifacts({
      projectSlug, jobNumber, ...opts
    }) {
      return this._makeRequest({
        path: `/project/${projectSlug}/${jobNumber}/artifacts`,
        ...opts,
      });
    },
    rerunWorkflow({
      workflowId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/workflow/${workflowId}/rerun`,
        ...opts,
      });
    },
  },
};
