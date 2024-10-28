import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "crowdin",
  propDefinitions: {
    projectId: {
      type: "string",
      label: "Project ID",
      description: "The ID of the project",
      async options() {
        const projects = await this.listProjects();
        return projects.map((project) => ({
          label: project.name,
          value: project.id,
        }));
      },
    },
    directoryId: {
      type: "string",
      label: "Directory ID",
      description: "The ID of the directory",
      optional: true,
      async options({ projectId }) {
        const directories = await this.listDirectories({
          projectId,
        });
        return directories.map((directory) => ({
          label: directory.name,
          value: directory.id,
        }));
      },
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name associated with the event or project",
    },
    sourceLanguageId: {
      type: "string",
      label: "Source Language ID",
      description: "The language ID of the source language",
      async options() {
        const languages = await this.listSupportedLanguages();
        return languages.map((language) => ({
          label: language.name,
          value: language.id,
        }));
      },
    },
    targetLanguageIds: {
      type: "string[]",
      label: "Target Language IDs",
      description: "Array of target language IDs",
      async options() {
        const languages = await this.listSupportedLanguages();
        return languages.map((language) => ({
          label: language.name,
          value: language.id,
        }));
      },
    },
    storageId: {
      type: "string",
      label: "Storage ID",
      description: "The ID of the storage",
      async options() {
        const storages = await this.listStorages();
        return storages.map((storage) => ({
          label: `Storage ${storage.id}`,
          value: storage.id,
        }));
      },
    },
    branchId: {
      type: "string",
      label: "Branch ID",
      description: "The ID of the branch",
      optional: true,
      async options({ projectId }) {
        const branches = await this.listBranches({
          projectId,
        });
        return branches.map((branch) => ({
          label: branch.name,
          value: branch.id,
        }));
      },
    },
    attachLabelIds: {
      type: "string[]",
      label: "Attach Label IDs",
      description: "The IDs of the labels to attach",
      optional: true,
      async options({ projectId }) {
        const labels = await this.listLabels({
          projectId,
        });
        return labels.map((label) => ({
          label: label.title,
          value: label.id,
        }));
      },
    },
    mtId: {
      type: "string",
      label: "Machine Translation ID",
      description: "The ID of the machine translation engine",
      async options() {
        const mts = await this.listMachineTranslations();
        return mts.map((mt) => ({
          label: mt.name,
          value: mt.id,
        }));
      },
    },
    strings: {
      type: "string[]",
      label: "Strings",
      description: "Array of strings to be translated",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.crowdin.com/api/v2";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path = "/", headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.access_token}`,
        },
      });
    },
    async listProjects(opts = {}) {
      return this._makeRequest({
        path: "/projects",
        ...opts,
      });
    },
    async listDirectories({
      projectId, ...opts
    }) {
      return this._makeRequest({
        path: `/projects/${projectId}/directories`,
        ...opts,
      });
    },
    async listSupportedLanguages(opts = {}) {
      return this._makeRequest({
        path: "/languages",
        ...opts,
      });
    },
    async listStorages(opts = {}) {
      return this._makeRequest({
        path: "/storages",
        ...opts,
      });
    },
    async listBranches({
      projectId, ...opts
    }) {
      return this._makeRequest({
        path: `/projects/${projectId}/branches`,
        ...opts,
      });
    },
    async listLabels({
      projectId, ...opts
    }) {
      return this._makeRequest({
        path: `/projects/${projectId}/labels`,
        ...opts,
      });
    },
    async listMachineTranslations(opts = {}) {
      return this._makeRequest({
        path: "/mts",
        ...opts,
      });
    },
    async emitCommentOrIssueEvent({
      projectId, name,
    }) {
      // Logic to listen and emit 'stringcomment.created' event
    },
    async emitFileApprovedEvent({
      projectId, name,
    }) {
      // Logic to listen and emit 'project.approved' event
    },
    async emitNewDirectoryEvent({
      projectId, directoryId,
    }) {
      // Logic to listen and emit event when a new directory is created
    },
    async createProject(data) {
      return this._makeRequest({
        method: "POST",
        path: "/projects",
        data,
      });
    },
    async uploadFileToProject({
      projectId, storageId, name, ...optionalParams
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/projects/${projectId}/files`,
        data: {
          storageId,
          name,
          ...optionalParams,
        },
      });
    },
    async performMachineTranslation({
      mtId, targetLanguageId, strings, ...optionalParams
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/mts/${mtId}/translations`,
        data: {
          targetLanguageId,
          strings,
          ...optionalParams,
        },
      });
    },
  },
};
