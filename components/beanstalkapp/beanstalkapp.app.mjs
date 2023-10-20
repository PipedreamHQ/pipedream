import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "beanstalkapp",
  propDefinitions: {
    login: {
      type: "string",
      label: "Username",
      description: "Writable only on create. Always required and must be unique in the Account.",
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email address of the user.",
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name of the user.",
    },
    password: {
      type: "string",
      label: "Password",
      description: "Password of the user.",
    },
    admin: {
      type: "boolean",
      label: "Admin",
      description: "Whether the user is an admin.",
      optional: true,
    },
    timezone: {
      type: "string",
      label: "Timezone",
      description: "Timezone of the user.",
      optional: true,
    },
    repositoryId: {
      type: "string",
      label: "Repository ID",
      description: "ID of the repository.",
      async options({ page }) {
        const repositories = await this.listRepositories({
          params: {
            page,
          },
        });
        return repositories.map(({ repository }) => ({
          label: repository.name,
          value: repository.id,
        }));
      },
    },
    branch: {
      type: "string",
      label: "Branch",
      description: "Branch of the repository.",
      async options({ repositoryId }) {
        const branches = await this.listBranches({
          repositoryId,
        });
        return branches.map(({ branch }) => branch);
      },
    },
    userId: {
      type: "string",
      label: "User ID",
      description: "ID of the user.",
      async options({ page }) {
        const users = await this.listUsers({
          params: {
            page,
          },
        });
        return users.map(({ user }) => ({
          label: user.name,
          value: user.id,
        }));
      },
    },
  },
  methods: {
    getBaseUrl() {
      const baseUrl = constants.BASE_URL
        .replace(constants.DOMAIN_PLACEHOLDER, this.$auth.domain);
      return `${baseUrl}${constants.VERSION_PATH}`;
    },
    getUrl(path, url) {
      return url || `${this.getBaseUrl()}${path}.json`;
    },
    getHeaders(headers) {
      return {
        "Content-Type": "application/json",
        "User-Agent": "Pipedream (support@pipedream.com)",
        ...headers,
      };
    },
    getAuth() {
      const {
        username,
        access_token: password,
      } = this.$auth;
      return {
        username,
        password,
      };
    },
    makeRequest({
      step = this, path, headers, url, ...args
    } = {}) {
      const config = {
        headers: this.getHeaders(headers),
        url: this.getUrl(path, url),
        auth: this.getAuth(),
        ...args,
      };
      return axios(step, config);
    },
    create(args = {}) {
      return this.makeRequest({
        method: "post",
        ...args,
      });
    },
    delete(args = {}) {
      return this.makeRequest({
        method: "delete",
        ...args,
      });
    },
    listRepositories(args = {}) {
      return this.makeRequest({
        path: "/repositories",
        ...args,
      });
    },
    listBranches({
      repositoryId, ...args
    } = {}) {
      return this.makeRequest({
        path: `/repositories/${repositoryId}/branches`,
        ...args,
      });
    },
    listUsers(args = {}) {
      return this.makeRequest({
        path: "/users",
        ...args,
      });
    },
    listChangesets(args = {}) {
      return this.makeRequest({
        path: "/changesets",
        ...args,
      });
    },
    async *getResourcesStream({
      resourceFn,
      resourceFnArgs,
      resourceName,
      max = constants.DEFAULT_MAX,
    }) {
      let page = 0;
      let resourcesCount = 0;

      while (true) {
        const nextResources =
          await resourceFn({
            ...resourceFnArgs,
            params: {
              page,
              ...resourceFnArgs.params,
            },
          });

        if (!nextResources?.length) {
          console.log("No more resources found");
          return;
        }

        for (const { [resourceName]: resource } of nextResources) {
          yield resource;
          resourcesCount += 1;

          if (resourcesCount >= max) {
            return;
          }
        }

        page += 1;
      }
    },
  },
};
