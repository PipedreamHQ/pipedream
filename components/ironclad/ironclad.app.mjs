import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "ironclad",
  version: "0.0.{{ts}}",
  propDefinitions: {
    recordType: {
      type: "string",
      label: "Type",
      description: "The type of the record",
      async options() {
        const { recordTypes } = await this.getRecordsSchema();
        return (Object.keys(recordTypes)).map((type) => type);
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
        const { properties } = await this.getRecordSchema();
        return (Object.keys(properties)).map((property) => property);
      },
    },
    selectedEvent: {
      type: "string[]",
      label: "Selected Events",
      description: "Select the Ironclad events to emit",
      async options() {
        const events = [
          "workflow_launched",
          "workflow_updated",
          "workflow_completed",
          "workflow_cancelled",
          "workflow_approval_status_changed",
          "workflow_attribute_updated",
          "workflow_comment_added",
          "workflow_comment_removed",
          "workflow_comment_updated",
          "workflow_comment_reaction_added",
          "workflow_comment_reaction_removed",
          "workflow_counterparty_invite_sent",
          "workflow_counterparty_invite_revoked",
          "workflow_documents_added",
          "workflow_documents_removed",
          "workflow_documents_updated",
          "workflow_documents_renamed",
          "workflow_document_edited",
          "workflow_changed_turn",
          "workflow_paused",
          "workflow_resumed",
          "workflow_roles_assigned",
          "workflow_signature_packet_sent",
          "workflow_signature_packet_signer_first_viewed",
          "workflow_signature_packet_signer_viewed",
          "workflow_signature_packet_uploaded",
          "workflow_signature_packet_signatures_collected",
          "workflow_signature_packet_fully_signed",
          "workflow_signature_packet_cancelled",
          "workflow_signer_added",
          "workflow_signer_removed",
          "workflow_signer_reassigned",
          "workflow_step_updated",
          "*",
        ];
        return events.map((event) => ({
          label: event.replace(/_/g, " ").toUpperCase(),
          value: event,
        }));
      },
    },
    workflowDetails: {
      type: "object",
      label: "Workflow Details",
      description: "Details required to launch a new workflow",
      properties: {
        templateId: {
          type: "string",
          label: "Template ID",
          description: "ID of the workflow template to use",
        },
        attributes: {
          type: "object",
          label: "Attributes",
          description: "Workflow attributes as key-value pairs",
        },
      },
    },
    attachments: {
      type: "string[]",
      label: "Attachments",
      description: "Optional attachments to include when launching workflow",
      optional: true,
    },
    workflowId: {
      type: "string",
      label: "Workflow ID",
      description: "ID of the workflow to update",
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
    getRecordsSchema(opts = {}) {
      return this._makeRequest({
        path: "/records/metadata",
        ...opts,
      });
    },
    listRecords(opts = {}) {
      return this._makeRequest({
        path: "/records",
        ...opts,
      });
    },
    async launchWorkflow(workflowDetails, attachments, user) {
      const data = {
        ...workflowDetails,
      };
      if (attachments && attachments.length > 0) {
        data.attachments = attachments;
      }
      if (user) {
        data.user = user;
      }
      return await this._makeRequest({
        method: "POST",
        path: "/workflows",
        data,
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
        path: `workflows/${workflowId}/attributes`,
        ...opts,
      });
    },
  },
};
