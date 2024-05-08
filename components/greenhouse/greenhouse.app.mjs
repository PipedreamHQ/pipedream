import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "greenhouse",
  propDefinitions: {
    candidateId: {
      type: "string",
      label: "Candidate ID",
      description: "The ID of the candidate whose application or status changes.",
    },
    applicationDetails: {
      type: "object",
      label: "Application Details",
      description: "The details of the new application submitted by a candidate.",
    },
    scheduleDetail: {
      type: "object",
      label: "Schedule Detail",
      description: "Details of the new interview schedule.",
    },
    timePeriod: {
      type: "string",
      label: "Time Period",
      description: "The specific time period within which a new interview is scheduled.",
    },
    candidateName: {
      type: "string",
      label: "Candidate's Name",
      description: "The name of the candidate.",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the candidate or prospect.",
    },
    contact: {
      type: "string",
      label: "Contact",
      description: "The contact information of the candidate or prospect.",
    },
    candidateAddress: {
      type: "string",
      label: "Candidate Address",
      description: "The address of the candidate.",
      optional: true,
    },
    summary: {
      type: "string",
      label: "Summary",
      description: "A brief summary about the candidate.",
      optional: true,
    },
    skills: {
      type: "string[]",
      label: "Skills",
      description: "A list of skills of the candidate or prospect.",
      optional: true,
    },
    qualifications: {
      type: "string",
      label: "Qualifications",
      description: "The qualifications of the prospect.",
      optional: true,
    },
    attachmentFile: {
      type: "string",
      label: "Attachment File",
      description: "The file to be attached to a candidate or prospect.",
    },
    attachmentDescription: {
      type: "string",
      label: "Attachment Description",
      description: "A description of the attachment.",
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Tags associated with the attachment.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://harvest.greenhouse.io/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        data,
        params,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Content-Type": "application/json",
          "On-Behalf-Of": `${this.$auth.user_id}`,
          "Authorization": `Basic ${this.$auth.api_key}`,
        },
        data,
        params,
      });
    },
    async createCandidate({
      candidateName, email, contact, candidateAddress, summary, skills,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/candidates",
        data: {
          first_name: candidateName,
          email_addresses: [
            {
              value: email,
              type: "work",
            },
          ],
          phone_numbers: [
            {
              value: contact,
              type: "mobile",
            },
          ],
          addresses: candidateAddress
            ? [
              {
                value: candidateAddress,
                type: "home",
              },
            ]
            : [],
          summary,
          skills,
        },
      });
    },
    async createProspect({
      candidateName, email, contact, candidateAddress, qualifications, skills,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/prospects",
        data: {
          first_name: candidateName,
          email_addresses: [
            {
              value: email,
              type: "work",
            },
          ],
          phone_numbers: [
            {
              value: contact,
              type: "mobile",
            },
          ],
          addresses: candidateAddress
            ? [
              {
                value: candidateAddress,
                type: "home",
              },
            ]
            : [],
          qualifications,
          skills,
        },
      });
    },
    async addAttachmentToCandidate({
      candidateId, attachmentFile, attachmentDescription, tags,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/candidates/${candidateId}/attachments`,
        data: {
          filename: attachmentFile,
          content: attachmentFile, // Assuming content is the file content encoded in base64
          description: attachmentDescription,
          tags,
        },
      });
    },
    async addApplicationToCandidate({
      candidateId, applicationDetails,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/candidates/${candidateId}/applications`,
        data: applicationDetails,
      });
    },
  },
};
