import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "iauditor_by_safetyculture",
  propDefinitions: {
    groupId: {
      type: "string",
      label: "Group",
      description: "Identifier of a group or organization",
      async options() {
        const { groups } = await this.listGroups();
        return groups?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    userId: {
      type: "string",
      label: "User",
      description: "Identifier of the user to update",
      async options({
        groupId, page,
      }) {
        if (!groupId) {
          return;
        }
        const limit = constants.DEFAULT_LIMIT;
        const params = {
          limit,
          offset: page * limit,
        };
        const { users } = await this.listUsers({
          groupId,
          params,
        });
        return users?.map(({
          user_id: value, firstname, lastname,
        }) => ({
          value,
          label: `${firstname} ${lastname}`,
        })) || [];
      },
    },
    templateId: {
      type: "string",
      label: "Template",
      description: "Identifier of a template",
      async options() {
        const { templates } = await this.listTemplates();
        return templates?.map(({
          template_id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    inspectionId: {
      type: "string",
      label: "Inspection",
      description: "Identifier of an inspection",
      async options() {
        const { audits } = await this.listInspections();
        return audits?.map(({ audit_id: id }) => id ) || [];
      },
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "First name of the user",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Last name of the user",
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email address of the user",
    },
    seatType: {
      type: "string",
      label: "Seat Type",
      description: "Seat type of the user",
      options: constants.SEAT_TYPES,
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.safetyculture.io";
    },
    _headers() {
      return {
        "Authorization": `Bearer ${this.$auth.api_token}`,
        "accept": "application/json",
        "sc-integration-id": "sc-readme",
      };
    },
    _makeRequest({
      $ = this,
      path,
      ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...args,
      });
    },
    createWebhook(args = {}) {
      return this._makeRequest({
        path: "/webhooks/v1/webhooks",
        method: "POST",
        ...args,
      });
    },
    deleteWebhook({
      hookId, ...args
    }) {
      return this._makeRequest({
        path: `/webhooks/v1/webhooks/${hookId}`,
        method: "DELETE",
        ...args,
      });
    },
    listGroups(args = {}) {
      return this._makeRequest({
        path: "/share/connections",
        ...args,
      });
    },
    listUsers({
      groupId, ...args
    }) {
      return this._makeRequest({
        path: `/groups/${groupId}/users`,
        ...args,
      });
    },
    listTemplates(args = {}) {
      return this._makeRequest({
        path: "/templates/search",
        ...args,
      });
    },
    listInspections(args = {}) {
      return this._makeRequest({
        path: "/audits/search",
        ...args,
      });
    },
    generatePdfReport({
      inspectionId, ...args
    }) {
      return this._makeRequest({
        path: `/audits/${inspectionId}/web_report_link`,
        ...args,
      });
    },
    createUser(args = {}) {
      return this._makeRequest({
        path: "/users",
        method: "POST",
        ...args,
      });
    },
    createInspection(args = {}) {
      return this._makeRequest({
        path: "/audits",
        method: "POST",
        ...args,
      });
    },
    shareInspection({
      inspectionId, ...args
    }) {
      return this._makeRequest({
        path: `/audits/${inspectionId}/share`,
        method: "POST",
        ...args,
      });
    },
    exportInspection(args = {}) {
      return this._makeRequest({
        path: "/inspection/v1/export",
        method: "POST",
        ...args,
      });
    },
    updateUser({
      userId, ...args
    }) {
      return this._makeRequest({
        path: `/users/${userId}`,
        method: "PUT",
        ...args,
      });
    },
  },
};
