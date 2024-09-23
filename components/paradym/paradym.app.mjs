import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "paradym",
  propDefinitions: {
    projectId: {
      type: "string",
      label: "Project ID",
      description: "The ID of the project.",
      async options({ prevContext: { pageBeforeId } }) {
        if (pageBeforeId === null) {
          return [];
        }
        const { data } = await this.listProjects({
          params: {
            "sort": "-updatedAt",
            "page[size]": constants.DEFAULT_LIMIT,
            "page[before]": pageBeforeId,
          },
        });
        const options = data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
        return {
          options,
          context: {
            pageBeforeId:
              data.length
                ? data[data.length - 1].id
                : null,
          },
        };
      },
    },
    sdJWTVCCredentialTemplateId: {
      type: "string",
      label: "SD-JWT-VC Credential Template ID",
      description: "The ID of the SD-JWT-VC credential template.",
      async options({
        projectId,
        prevContext: { pageBeforeId },
      }) {
        if (pageBeforeId === null) {
          return [];
        }
        const { data } = await this.listSDJWTVCCredentialTemplates({
          projectId,
          params: {
            "sort": "-updatedAt",
            "page[size]": constants.DEFAULT_LIMIT,
            "page[before]": pageBeforeId,
          },
        });
        const options = data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
        return {
          options,
          context: {
            pageBeforeId:
              data.length
                ? data[data.length - 1].id
                : null,
          },
        };
      },
    },
    anoncredsCredentialTemplateId: {
      type: "string",
      label: "Anoncreds Credential Template ID",
      description: "The ID of the anoncreds credential template.",
      async options({
        projectId,
        prevContext: { pageBeforeId },
      }) {
        if (pageBeforeId === null) {
          return [];
        }
        const { data } = await this.listAnonCredsCredentialTemplates({
          projectId,
          params: {
            "sort": "-updatedAt",
            "page[size]": constants.DEFAULT_LIMIT,
            "page[before]": pageBeforeId,
          },
        });
        const options = data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
        return {
          options,
          context: {
            pageBeforeId:
              data.length
                ? data[data.length - 1].id
                : null,
          },
        };
      },
    },
    presentationTemplateId: {
      type: "string",
      label: "Presentation Template ID",
      description: "The ID of the presentation template.",
      async options({
        projectId,
        prevContext: { pageBeforeId },
      }) {
        if (pageBeforeId === null) {
          return [];
        }
        const { data } = await this.listPresentationTemplates({
          projectId,
          params: {
            "sort": "-updatedAt",
            "page[size]": constants.DEFAULT_LIMIT,
            "page[before]": pageBeforeId,
          },
        });
        const options = data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
        return {
          options,
          context: {
            pageBeforeId:
              data.length
                ? data[data.length - 1].id
                : null,
          },
        };
      },
    },
    openId4VcVerificationId: {
      type: "string",
      label: "OpenID4VC Verification ID",
      description: "The ID of the OpenID4VC verification.",
      async options({
        projectId,
        prevContext: { pageBeforeId },
      }) {
        if (pageBeforeId === null) {
          return [];
        }
        const { data } = await this.listOpenId4VcVerifications({
          projectId,
          params: {
            "sort": "-updatedAt",
            "page[size]": constants.DEFAULT_LIMIT,
            "page[before]": pageBeforeId,
          },
        });
        return {
          options: data.map(({ id }) => id),
          context: {
            pageBeforeId:
              data.length
                ? data[data.length - 1].id
                : null,
          },
        };
      },
    },
  },
  methods: {
    getUrl(path) {
      return `${constants.BASE_URL}${constants.VERSION_PATH}${path}`;
    },
    getHeaders(headers) {
      return {
        ...headers,
        "X-Access-Token": this.$auth.api_key,
      };
    },
    _makeRequest({
      $ = this, path, headers, ...args
    } = {}) {
      return axios($, {
        ...args,
        url: this.getUrl(path),
        headers: this.getHeaders(headers),
      });
    },
    post(args = {}) {
      return this._makeRequest({
        method: "POST",
        ...args,
      });
    },
    delete(args = {}) {
      return this._makeRequest({
        method: "DELETE",
        ...args,
      });
    },
    listProjects(args = {}) {
      return this._makeRequest({
        path: "/projects",
        ...args,
      });
    },
    listSDJWTVCCredentialTemplates({
      projectId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/projects/${projectId}/templates/credentials/sd-jwt-vc`,
        ...args,
      });
    },
    listAnonCredsCredentialTemplates({
      projectId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/projects/${projectId}/templates/credentials/anoncreds`,
        ...args,
      });
    },
    getSDJWTVCCredentialTemplate({
      projectId, credentialTemplateId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/projects/${projectId}/templates/credentials/sd-jwt-vc/${credentialTemplateId}`,
        ...args,
      });
    },
    getAnonCredsCredentialTemplate({
      projectId, credentialTemplateId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/projects/${projectId}/templates/credentials/anoncreds/${credentialTemplateId}`,
        ...args,
      });
    },
    listPresentationTemplates({
      projectId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/projects/${projectId}/templates/presentations`,
        ...args,
      });
    },
    listOpenId4VcVerifications({
      projectId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/projects/${projectId}/openid4vc/verification`,
        ...args,
      });
    },
  },
};
