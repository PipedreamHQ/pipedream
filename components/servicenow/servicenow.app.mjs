import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

const {
  DEFAULT_SEVERITY_OPTIONS,
  INCIDENT_SEVERITY_OPTIONS,
} = constants;

export default {
  type: "app",
  app: "servicenow",
  propDefinitions: {
    name: {
      type: "string",
      label: "Name",
      description: "A short description of the ticket issue.",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "A detailed description of the issue.",
    },
    caseSeverity: {
      type: "string",
      label: "Severity",
      description: "The priority/severity of the case.",
      options: DEFAULT_SEVERITY_OPTIONS,
    },
    incidentSeverity: {
      type: "string",
      label: "Severity",
      description: "The priority/severity of the incident.",
      options: INCIDENT_SEVERITY_OPTIONS,
    },
    status: {
      type: "string",
      label: "Status",
      description: "The current status of the ticket.",
      optional: true,
      default: "New",
    },
    channelName: {
      type: "string",
      label: "Channel Name",
      description: "The channel that the ticket was created through.",
      optional: true,
    },
    contactMethod: {
      type: "string",
      label: "Contact Name",
      description: "Method of contact that the ticket was created through.",
      optional: true,
    },
    accountId: {
      type: "string",
      label: "Account ID",
      description: "Sys_id of the account related to the case.",
      optional: true,
    },
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "Sys_id of the contact related to the case.",
      optional: true,
    },
    companyId: {
      type: "string",
      label: "Company ID",
      description: "Sys_id of the company related to the incident.",
      optional: true,
    },
    userId: {
      type: "string",
      label: "User ID",
      description: "Sys_id of the user related to the incident.",
      optional: true,
    },
    workNote: {
      type: "string",
      label: "Work Note",
      description: "Internal work note for the ticket.",
      optional: true,
    },
    comment: {
      type: "string",
      label: "Comment",
      description: "Additional comment for the ticket.",
      optional: true,
    },
  },
  methods: {
    baseUrl() {
      const { instance_name: instanceName } = this.$auth;
      return `https://${instanceName}.service-now.com`;
    },
    authHeaders() {
      const { oauth_access_token: oauthAccessToken } = this.$auth;
      return {
        "Authorization": `Bearer ${oauthAccessToken}`,
        "Accept": "application/json",
        "Content-Type": "application/json",
      };
    },
    buildChannel(name) {
      if (!name) {
        return;
      }
      return {
        name,
      };
    },
    buildNotes({
      workNote,
      comment,
    } = {}) {
      const notes = [];
      if (workNote) {
        notes.push({
          "text": workNote,
          "@type": "work_notes",
        });
      }
      if (comment) {
        notes.push({
          "text": comment,
          "@type": "comments",
        });
      }
      return notes.length
        ? notes
        : undefined;
    },
    buildRelatedParties(partyTypeToId = {}) {
      const entries = Object.entries(partyTypeToId)
        .filter(([
          , id,
        ]) => id);
      if (!entries.length) {
        return;
      }
      return entries.map(([
        type,
        id,
      ]) => ({
        id,
        "@referredType": type,
      }));
    },
    async createTroubleTicket({
      $ = this,
      ticketType,
      name,
      description,
      severity,
      status,
      channelName,
      notes,
      relatedParties,
      extraFields,
    } = {}) {
      const data = {
        notes,
        relatedParties,
        ticketType,
        ...extraFields,
        name,
        description,
        severity,
        status,
        channel: this.buildChannel(channelName),
      };

      return axios($, {
        method: "post",
        url: `${this.baseUrl()}/api/sn_ind_tsm_sdwan/ticket/troubleTicket`,
        headers: this.authHeaders(),
        data,
      });
    },
  },
};
