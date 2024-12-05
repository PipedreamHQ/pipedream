import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "ironclad",
  version: "0.0.{{ts}}",
  propDefinitions: {
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
    user: {
      type: "object",
      label: "User",
      description: "Optional user information for actions that support it",
      optional: true,
      properties: {
        userId: {
          type: "string",
          label: "User ID",
          description: "ID of the user performing the action",
        },
      },
    },
    recordData: {
      type: "object",
      label: "Record Data",
      description: "Data required to create a new record in Ironclad",
      properties: {
        type: {
          type: "string",
          label: "Record Type",
          description: "Type/category of the record",
        },
        name: {
          type: "string",
          label: "Name",
          description: "Name/title of the record",
        },
        properties: {
          type: "object",
          label: "Properties",
          description: "Metadata properties of the record",
        },
      },
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Optional tags for the record",
      optional: true,
    },
    workflowId: {
      type: "string",
      label: "Workflow ID",
      description: "ID of the workflow to update",
    },
    updatedMetadata: {
      type: "object",
      label: "Updated Metadata",
      description: "New metadata to update the workflow",
      properties: {
        status: {
          type: "string",
          label: "Status",
          description: "New status for the workflow",
        },
        comments: {
          type: "string",
          label: "Comments",
          description: "Additional comments for the workflow",
        },
      },
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://api.ironcladapp.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $, method = "GET", path = "/", headers, ...otherOpts
      } = opts;
      return axios($, {
        method,
        url: `${this._baseUrl()}${path}`,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_token}`,
        },
        ...otherOpts,
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
    async createRecord(recordData, user, tags) {
      const data = {
        ...recordData,
      };
      if (user) {
        data.user = user;
      }
      if (tags && tags.length > 0) {
        data.tags = tags;
      }
      return await this._makeRequest({
        method: "POST",
        path: "/records",
        data,
      });
    },
    async updateWorkflowMetadata(workflowId, updatedMetadata) {
      return await this._makeRequest({
        method: "PATCH",
        path: `/workflows/${workflowId}`,
        data: updatedMetadata,
      });
    },
  },
};
