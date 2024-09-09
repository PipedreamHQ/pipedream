import { axios } from "@pipedream/platform";
import FormData from "form-data";
import fs from "fs";
import {
  checkTmp,
  parseObject,
} from "./common/utils.mjs";

export default {
  type: "app",
  app: "security_reporter",
  propDefinitions: {
    clientId: {
      type: "string",
      label: "Client ID",
      description: "The ID of the client",
      async options({ page }) {
        const { data } = await this.listClients({
          params: {
            "page[number]": page + 1,
          },
        });

        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    assessmentTemplateId: {
      type: "string",
      label: "Assessment Template ID",
      description: "The ID of the assessment template",
      async options({ page }) {
        const { data } = await this.listAssessmentTemplates({
          params: {
            "page[number]": page + 1,
          },
        });

        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    languageId: {
      type: "string",
      label: "Language ID",
      description: "The ID of the language",
      async options({ page }) {
        const { data } = await this.listLanguages({
          params: {
            "page[number]": page + 1,
          },
        });

        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    themeId: {
      type: "string",
      label: "Theme ID",
      description: "ID of the report theme. If this is not set, the default theme will be used.",
      async options({ page }) {
        const { data } = await this.listThemes({
          params: {
            "page[number]": page + 1,
          },
        });

        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    resolvers: {
      type: "string[]",
      label: "Resolvers",
      description: "User IDs of users assigned to resolve the finding.",
      async options({
        assessmentId, findingId,
      }) {
        const id = await this.getAssesmentId({
          assessmentId,
          findingId,
        });
        const { users } = await this.getAssessment({
          assessmentId: id,
          params: {
            include: "users",
          },
        });

        return users.map(({
          id: value, email: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    userGroups: {
      type: "string[]",
      label: "User Groups",
      description: "The user groups for the finding",
      async options({
        assessmentId, findingId,
      }) {
        const id = await this.getAssesmentId({
          assessmentId,
          findingId,
        });
        const { userGroups } = await this.getAssessment({
          assessmentId: id,
          params: {
            include: "userGroups",
          },
        });

        return userGroups.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    resolvedTargets: {
      type: "string[]",
      label: "Resolved Targets",
      description: "The targets for which the finding is resolved. If all targets are resolved, the finding is resolved as well.",
      async options({ findingId }) {
        const { targets } = await this.getFinding({
          findingId,
          params: {
            include: "targets",
          },
        });

        return targets.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    targets: {
      type: "string[]",
      label: "Targets",
      description: "The IDs of targets the finding applies to. Each target must belong to the assessment.",
      async options({
        page, assessmentId, findingId,
      }) {
        const id = await this.getAssesmentId({
          assessmentId,
          findingId,
        });
        const { data } = await this.listTargets({
          params: {
            "page[number]": page + 1,
            "filter[assessment_id]": id,
          },
        });

        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    assessmentSectionId: {
      type: "string",
      label: "Assessment Section ID",
      description: "The ID of the assessment section to put the finding in. The section must belong to the assessment, and its can_have_findings must be true.",
      async options({
        assessmentId, findingId,
      }) {
        const id = await this.getAssesmentId({
          assessmentId,
          findingId,
        });
        const { sections } = await this.getAssessment({
          assessmentId: id,
          params: {
            include: "sections",
          },
        });

        return sections.filter(({ can_have_findings }) => can_have_findings).map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name associated with the webhook.",
    },
    assessmentId: {
      type: "string",
      label: "Assessment ID",
      description: "The ID of the assessment",
      async options({ page }) {
        const { data } = await this.listAssessments({
          params: {
            "page[number]": page + 1,
          },
        });

        return data.map(({
          id: value, title: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    findingId: {
      type: "string",
      label: "Finding ID",
      description: "The ID of the finding",
      async options({ page }) {
        const { data } = await this.listFindings({
          params: {
            "page[number]": page + 1,
          },
        });

        return data.map(({
          id: value, title: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return `${this.$auth.base_url}/api/v1`;
    },
    _headers(headers = {}) {
      return {
        "Authorization": `Bearer ${this.$auth.api_token}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
        ...headers,
      };
    },
    _makeRequest({
      $ = this, path, headers, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(headers),
        ...opts,
      });
    },
    async getAssesmentId({
      assessmentId, findingId,
    }) {
      if (assessmentId) return assessmentId;
      const { assessment_id: id } = await this.getFinding({
        findingId,
      });
      return id;
    },
    createAssessment({
      clientId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/clients/${clientId}/assessments`,
        ...opts,
      });
    },
    getAssessment({
      assessmentId, ...opts
    }) {
      return this._makeRequest({
        path: `/assessments/${assessmentId}`,
        ...opts,
      });
    },
    getFinding({
      findingId, ...opts
    }) {
      return this._makeRequest({
        path: `/findings/${findingId}`,
        ...opts,
      });
    },
    listClients(opts = {}) {
      return this._makeRequest({
        path: "/clients",
        ...opts,
      });
    },
    listTargets(opts = {}) {
      return this._makeRequest({
        path: "/targets",
        ...opts,
      });
    },

    listAssessments(opts = {}) {
      return this._makeRequest({
        path: "/assessments",
        ...opts,
      });
    },
    listFindings(opts = {}) {
      return this._makeRequest({
        path: "/findings",
        ...opts,
      });
    },
    listAssessmentTemplates(opts = {}) {
      return this._makeRequest({
        path: "/assessment-templates",
        ...opts,
      });
    },
    listLanguages(opts = {}) {
      return this._makeRequest({
        path: "/languages",
        ...opts,
      });
    },
    listThemes(opts = {}) {
      return this._makeRequest({
        path: "/themes",
        ...opts,
      });
    },
    createSecurityFinding({
      assessmentId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/assessments/${assessmentId}/findings`,
        ...opts,
      });
    },
    updateSecurityFinding({
      findingId, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/findings/${findingId}`,
        ...opts,
      });
    },
    createWebhook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/webhooks",
        ...opts,
      });
    },
    deleteWebhook(webhookId) {
      return this._makeRequest({
        method: "DELETE",
        path: `/webhooks/${webhookId}`,
      });
    },
    uploadFile(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/documents",
        ...opts,
      });
    },
    async prepareFiles({
      draftDocumentsFile = null, draftDocuments = null,
    }) {
      const fileIds = [];
      if (draftDocumentsFile) {
        const files = parseObject(draftDocumentsFile);
        for (const path of files) {
          const data = new FormData();
          const file = fs.createReadStream(checkTmp(path));
          data.append("file", file);
          data.append("documentable_type", "Finding");
          data.append("section", "description");
          const { id } = await this.uploadFile({
            data,
            headers: data.getHeaders(),
          });
          fileIds.push(id);
        }
      }

      if (draftDocuments) {
        for (const document of parseObject(draftDocuments)) {
          fileIds.push(document);
        }
      }
      return fileIds;
    },
  },
};
