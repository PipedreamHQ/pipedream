import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "document360",
  propDefinitions: {
    projectVersionId: {
      type: "string",
      label: "Project Version ID",
      description: "Select a Project Version or provide a custom Project Version ID.",
      async options() {
        const versions = await this.getProjectVersions();
        return versions?.data?.map?.((version) => ({
          label: `Version ${version.version_number}: ${version.version_code_name}`,
          value: version.id,
        })) ?? [];
      },
    },
    categoryId: {
      type: "string",
      label: "Category ID",
      description: "Select a Category or provide a custom Category ID.",
      async options({ projectVersionId }) {
        const categories = await this.getCategories(projectVersionId);
        return categories?.data?.map?.(({
          id, name,
        }) => ({
          label: name,
          value: id,
        })) ?? [];
      },
    },
    userId: {
      type: "string",
      label: "User ID",
      description: "Select a User or provide a custom User ID.",
      async options({ page }) {
        const users = await this.getUsers({
          params: {
            skip: page * 100,
            take: 100,
          },
        });
        return users?.result?.map?.(({
          first_name, last_name, user_id,
        }) => ({
          label: `${first_name || ""} ${last_name || ""}`.trim() || user_id,
          value: user_id,
        })) ?? [];
      },
    },
    folderId: {
      type: "string",
      label: "Folder ID",
      description: "Select a Folder or provide a custom Folder ID.",
      async options() {
        const folders = await this.getFolders();
        return this._flattenFolders(folders?.data) ?? [];
      },
    },
    fileId: {
      type: "string",
      label: "File ID",
      description: "Select a File or provide a custom File ID.",
      async options({ folderId }) {
        if (!folderId) {
          return [];
        }
        const folderInfo = await this.getFolderInformation({
          folderId,
          debug: true,
        });
        return folderInfo?.data?.files?.map?.(({
          id: value, file_name: label,
        })  => ({
          label,
          value,
        })) ?? [];
      },
    },
    articleId: {
      type: "string",
      label: "Article ID",
      description: "Select an Article or provide a custom Article ID.",
      async options({ projectVersionId }) {
        if (!projectVersionId) {
          return [];
        }
        const articles = await this.getArticles(projectVersionId);
        return articles?.data?.map?.((article) => ({
          label: article.title || article.id,
          value: article.id,
        })) ?? [];
      },
    },
    langCode: {
      type: "string",
      label: "Language Code",
      description: "Select a Language Code or provide a custom Language Code.",
      async options({ projectVersionId }) {
        if (!projectVersionId) {
          return [];
        }
        const languages = await this.getProjectLanguages(projectVersionId);
        return languages?.data?.map?.((language) => ({
          label: `${language.language_name} (${language.language_code})`,
          value: language.language_code,
        })) ?? [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://apihub.document360.io/v2";
    },
    _makeRequest({
      $ = this,
      path,
      headers,
      ...otherOpts
    }) {
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "api_token": this.$auth.api_key,
        },
      });
    },
    getProjectVersions() {
      return this._makeRequest({
        path: "/ProjectVersions",
      });
    },
    getUsers() {
      return this._makeRequest({
        path: "/Teams",
      });
    },
    getCategories(projectVersionId) {
      return this._makeRequest({
        path: `/ProjectVersions/${projectVersionId}/categories`,
      });
    },
    getArticles(projectVersionId) {
      return this._makeRequest({
        path: `/ProjectVersions/${projectVersionId}/articles`,
      });
    },
    getProjectLanguages(projectVersionId) {
      return this._makeRequest({
        path: `/Language/${projectVersionId}`,
      });
    },
    createDocument(args) {
      return this._makeRequest({
        method: "POST",
        path: "/Articles",
        ...args,
      });
    },
    getFileInformation({
      folderId, fileId, ...args
    }) {
      return this._makeRequest({
        path: `/Drive/Folders/${folderId}/${fileId}`,
        ...args,
      });
    },
    driveSearchFilesAndFolders(args) {
      return this._makeRequest({
        path: "/Drive/Search",
        ...args,
      });
    },
    getArticle({
      articleId, langCode, ...args
    }) {
      return this._makeRequest({
        path: `/Articles/${articleId}/${langCode}`,
        ...args,
      });
    },
    getFolders(args) {
      return this._makeRequest({
        path: "/Drive/Folders",
        ...args,
      });
    },
    getFolderInformation({
      folderId, ...args
    }) {
      return this._makeRequest({
        path: `/Drive/Folders/${folderId}`,
        ...args,
      });
    },
    _flattenFolders(folders, prefix = "") {
      const result = [];

      folders?.forEach((folder) => {
        const folderLabel = folder.title || folder.id;
        const currentLabel = prefix
          ? `${prefix} > ${folderLabel}`
          : folderLabel;

        // Add the current folder
        result.push({
          label: currentLabel,
          value: folder.id,
        });

        // Recursively add sub-folders
        if (folder.sub_folders && folder.sub_folders.length > 0) {
          const subFolders = this._flattenFolders(folder.sub_folders, currentLabel);
          result.push(...subFolders);
        }
      });

      return result;
    },
  },
};
