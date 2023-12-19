import { axios } from "@pipedream/platform";
import {
  CLASSES, LIMIT,
} from "./common/constants.mjs";

export default {
  type: "app",
  app: "click2mail2",
  propDefinitions: {
    addressId: {
      type: "string",
      label: "Address Id",
      description: "This required if the product required a recipient address list.",
      async options({ page }) {
        const { addressListsInfo } = await this.list({
          path: "addressLists",
          params: {
            numberOfDocuments: LIMIT,
            offset: page * LIMIT,
          },
        });

        return addressListsInfo.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    documentClass: {
      type: "string",
      label: "Document Class",
      description: "The general type of the document.",
      options: CLASSES,
    },
    documentId: {
      type: "string",
      label: "Document Id",
      description: "ID of the document to print",
      async options({ page }) {
        const { document } = await this.list({
          path: "documents",
          params: {
            numberOfDocuments: LIMIT,
            offset: page * LIMIT,
          },
        });

        return document.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    jobDocumentId: {
      type: "string",
      label: "Job Document Id",
      description: "Document ID of the job version of the document.",
      async options({
        page, documentId,
      }) {
        try {

          const { documentJob } = await this.list({
            path: "documents/jobDocuments",
            params: {
              numberOfDocuments: LIMIT,
              offset: page * LIMIT,
              documentId,
            },
          });

          return documentJob.map(({
            jobId: value, description, product,
          }) => ({
            label: description || product,
            value,
          }));
        } catch (e) {
          return [];
        }
      },
    },
    projectId: {
      type: "integer",
      label: "Project Id",
      description: "Use to place this job in a pre-existing project in your account",
      async options({ page }) {
        const { projects } = await this.list({
          path: "projects",
          params: {
            numberOfDocuments: LIMIT,
            offset: page * LIMIT,
          },
        });

        return projects.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _apiUrl() {
      return `https://${this.$auth.subdomain}.click2mail.com/molpro`;
    },
    _getAuth() {
      return {
        "username": `${this.$auth.username}`,
        "password": `${this.$auth.password}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      const config = {
        url: `${this._apiUrl()}/${path}`,
        auth: this._getAuth(),
        ...opts,
      };

      return axios($, config);
    },
    create(args = {}) {
      return this._makeRequest({
        method: "POST",
        ...args,
      });
    },
    list(args = {}) {
      return this._makeRequest({
        method: "GET",
        ...args,
      });
    },
  },
};
