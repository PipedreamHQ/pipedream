// x-pd-ai: optimized
import { axios } from "@pipedream/platform";
import events from "./sources/common/events.mjs";

export default {
  type: "app",
  app: "ironclad",
  propDefinitions: {
    recordType: {
      type: "string",
      label: "Type",
      description: "The record type identifier. Call **List Type Options** to discover valid type keys (e.g. `vendor_agreement`).",
      async options() {
        const { recordTypes } = await this.getRecordsSchema();
        return Object.entries(recordTypes).map(([
          key,
          value,
        ]) => ({
          value: key,
          label: value.displayName,
        }));
      },
    },
    recordId: {
      type: "string",
      label: "Record ID",
      description: "The identifier of a record. Obtain via **Search Records**.",
      optional: true,
      async options({ page }) {
        const { list } = await this.listRecords({
          params: {
            page,
          },
        });
        return list?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    templateId: {
      type: "string",
      label: "Template ID",
      description: "The identifier of a workflow template. Obtain via **Describe Workspace** (e.g. `tmpl_abc123`).",
      async options() {
        const { list } = await this.listWorkflowSchemas();
        return list?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    workflowId: {
      type: "string",
      label: "Workflow ID",
      description: "The identifier of a workflow. Obtain via **Search Workflows**.",
      async options({ page }) {
        const { list } = await this.listWorkflows({
          params: {
            page,
          },
        });
        return list?.map(({
          id: value, title: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    selectedEvents: {
      type: "string[]",
      label: "Selected Events",
      description: "Ironclad event types to listen for. Call **List Selected Events Options** to discover valid event type strings (e.g. `workflow_launched`, `workflow_completed`).",
      async options() {
        return events.map((event) => ({
          label: event.replace(/_/g, " ").toUpperCase(),
          value: event,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://ironcladapp.com/public/api/v1";
    },
    _makeRequest(opts = {}) {
      const {
        $,  path, ...otherOpts
      } = opts;
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
        ...otherOpts,
      });
    },
    createWebhook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/webhooks",
        ...opts,
      });
    },
    deleteWebhook({
      webhookId, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/webhooks/${webhookId}`,
        ...opts,
      });
    },
    getRecordsSchema(opts = {}) {
      return this._makeRequest({
        path: "/records/metadata",
        ...opts,
      });
    },
    getWorkflow({
      workflowId, ...opts
    }) {
      return this._makeRequest({
        path: `/workflows/${workflowId}`,
        ...opts,
      });
    },
    getWorkflowSchema({
      templateId, ...opts
    }) {
      return this._makeRequest({
        path: `/workflow-schemas/${templateId}?form=launch`,
        ...opts,
      });
    },
    listWorkflowSchemas(opts = {}) {
      return this._makeRequest({
        path: "/workflow-schemas?form=launch",
        ...opts,
      });
    },
    listWorkflows(opts = {}) {
      return this._makeRequest({
        path: "/workflows",
        ...opts,
      });
    },
    getRecord({
      recordId, ...opts
    }) {
      return this._makeRequest({
        path: `/records/${recordId}`,
        ...opts,
      });
    },
    listRecords(opts = {}) {
      return this._makeRequest({
        path: "/records",
        ...opts,
      });
    },
    launchWorkflow(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/workflows",
        ...opts,
      });
    },
    createRecord(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/records",
        ...opts,
      });
    },
    updateWorkflowMetadata({
      workflowId, ...opts
    }) {
      return this._makeRequest({
        method: "PATCH",
        path: `/workflows/${workflowId}/attributes`,
        ...opts,
      });
    },
    updateRecord({
      recordId, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/records/${recordId}`,
        ...opts,
      });
    },
    deleteRecord({
      recordId, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/records/${recordId}`,
        ...opts,
      });
    },
  },
};
