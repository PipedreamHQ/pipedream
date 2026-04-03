import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "certs365-beta",

  auth: {
    type: "api_key",
    api_key: {
      type: "string",
      label: "API Key",
    },
  },

  propDefinitions: {
    name: {
      type: "string",
      label: "Recipient Name",
      description: "Name of the certificate recipient",
    },
    recipientEmail: {
      type: "string",
      label: "Recipient Email",
      description: "Email of the certificate recipient",
      pattern: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
      message: "Please enter a valid email address (e.g., user@example.com)",
    },
    courseName: {
      type: "string",
      label: "Course Name",
      description: "Name of the course for which certificate is issued",
    },
    templateId: {
      type: "string",
      label: "Template ID",
      description: "Template ID used for certificate generation",
      optional: true,
    },
    customFields: {
      type: "string",
      label: "Custom Fields (JSON)",
      description: "Custom fields in JSON format",
      optional: true,
    },
  },

  methods: {
    async issueCertificate({
      $, data,
    }) {
      return axios($, {
        method: "POST",
        // TODO (CERTS365-API / OWNER: Certs365 Team):
        // This is a beta/test endpoint and MUST be replaced before production release.
        // Replace with production endpoint:
        // https://api2.certs365.io/proui/api/issue-pipedream (confirm final path)
        url: "https://testverifyapi.certs365.io/proui/api/issue-pipedream",
        timeout: 10000,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.$auth.api_key}`,
        },
        data,
      });
    },
  },
};
