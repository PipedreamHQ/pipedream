import { axios } from "@pipedream/platform";
import events from "./sources/common/events.mjs";

export default {
  type: "app",
  app: "ironclad",
  propDefinitions: {
    recordType: {
      type: "string",
      label: "Type",
      description: "The type of the record",
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
      description: "The identifier of a record",
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
    properties: {
      type: "string[]",
      label: "Properties",
      description: "Properties to add to the record",
      async options() {
        const { properties } = await this.getRecordsSchema();
        return Object.entries(properties).map(([
          key,
          value,
        ]) => ({
          value: key,
          label: value.displayName,
        }));
      },
    },
    templateId: {
      type: "string",
      label: "Template ID",
      description: "The identifier of a workflow template",
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
      description: "The identifier of a workflow",
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
      description: "Select the Ironclad events to emit",
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
  },
};
