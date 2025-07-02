import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "bugsnag",
  propDefinitions: {
    organizationId: {
      type: "string",
      label: "Organization ID",
      description: "The ID of an organization",
      async options() {
        const organizations = await this.listOrganizations();
        return organizations?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    projectId: {
      type: "string",
      label: "Project ID",
      description: "The ID of a project",
      async options({
        organizationId, prevContext,
      }) {
        const args = {
          organizationId,
          returnFullResponse: true,
        };
        if (prevContext?.next) {
          args.url = prevContext.next;
        }
        const {
          data, headers,
        } = await this.listProjects(args);
        let next;
        if (headers?.link) {
          next = this.getNextLink(headers.link);
        }
        return {
          options: data?.map(({
            id: value, name: label,
          }) => ({
            value,
            label,
          })) || [],
          context: {
            next,
          },
        };
      },
    },
    errorId: {
      type: "string",
      label: "Error ID",
      description: "The ID of the error",
      async options({
        projectId, prevContext,
      }) {
        const args = {
          projectId,
          returnFullResponse: true,
        };
        if (prevContext?.next) {
          args.url = prevContext.next;
        }
        const {
          data, headers,
        } = await this.listErrors(args);
        let next;
        if (headers?.link) {
          next = this.getNextLink(headers.link);
        }
        return {
          options: data?.map(({
            id: value, message: label,
          }) => ({
            value,
            label,
          })) || [],
          context: {
            next,
          },
        };
      },
    },
    releaseStage: {
      type: "string",
      label: "Release Stage",
      description: "The release stage",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.bugsnag.com";
    },
    _makeRequest({
      $ = this, url, path, ...opts
    }) {
      return axios($, {
        url: url || `${this._baseUrl()}${path}`,
        headers: {
          "Authorization": `token ${this.$auth.api_token}`,
        },
        ...opts,
      });
    },
    getNextLink(linkHeader) {
      const match = linkHeader.match(/<([^>]+)>;\s*rel="next"/); // get link to next page
      return match
        ? match[1]
        : null;
    },
    listOrganizations(opts = {}) {
      return this._makeRequest({
        path: "/user/organizations",
        ...opts,
      });
    },
    listProjects({
      organizationId, ...opts
    }) {
      return this._makeRequest({
        path: `/organizations/${organizationId}/projects`,
        ...opts,
      });
    },
    listErrors({
      projectId, ...opts
    }) {
      return this._makeRequest({
        path: `/projects/${projectId}/errors`,
        ...opts,
      });
    },
    listEvents({
      projectId, ...opts
    }) {
      return this._makeRequest({
        path: `/projects/${projectId}/events`,
        ...opts,
      });
    },
    listReleases({
      projectId, ...opts
    }) {
      return this._makeRequest({
        path: `/projects/${projectId}/releases`,
        ...opts,
      });
    },
    createProject({
      organizationId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/organizations/${organizationId}/projects`,
        ...opts,
      });
    },
    updateError({
      projectId, errorId, ...opts
    }) {
      return this._makeRequest({
        method: "PATCH",
        path: `/projects/${projectId}/errors/${errorId}`,
        ...opts,
      });
    },
    async *paginate({
      fn, args, max,
    }) {
      args = {
        ...args,
        returnFullResponse: true,
      };
      let next, count = 0;
      do {
        const {
          data, headers,
        } = await fn(args);
        for (const item of data) {
          yield item;
          if (max && ++count >= max) {
            return;
          }
        }
        next = headers?.link
          ? this.getNextLink(headers.link)
          : false;
        args.url = next;
        args.params = undefined;
      } while (next);
    },
  },
};
