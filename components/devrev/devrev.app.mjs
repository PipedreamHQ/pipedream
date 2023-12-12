import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "devrev",
  propDefinitions: {
    workId: {
      type: "string",
      label: "Work Item",
      description: "The ID of the object to create the comment for.",
      async options({
        prevContext, type,
      }) {
        return this.getPropOptions({
          prevContext,
          resourceFn: this.listWorks,
          args: type
            ? {
              params: {
                type,
              },
            }
            : {},
          resourceKey: "works",
          mapper: ({
            id: value, title: label,
          }) => ({
            value,
            label,
          }),
        });
      },
    },
    partId: {
      type: "string",
      label: "Applies To Part",
      description: "The part that the work applies to",
      async options({ prevContext }) {
        return this.getPropOptions({
          prevContext,
          resourceFn: this.listParts,
          resourceKey: "parts",
          mapper: ({
            id: value, name: label,
          }) => ({
            value,
            label,
          }),
        });
      },
    },
    userIds: {
      type: "string[]",
      label: "Users",
      description: "Array of user IDs",
      async options({ prevContext }) {
        return this.getPropOptions({
          prevContext,
          resourceFn: this.listUsers,
          resourceKey: "dev_users",
          mapper: ({
            id: value, full_name: label,
          }) => ({
            value,
            label,
          }),
        });
      },
    },
    customSchemaFragmentIds: {
      type: "string[]",
      label: "Custom Schema Fragments",
      description: "Array of IDs of custom schema fragments to use",
      optional: true,
      async options({ prevContext }) {
        return this.getPropOptions({
          prevContext,
          resourceFn: this.listCustomSchemaFragments,
          resourceKey: "result",
          mapper: ({
            id: value, display_id: label,
          }) => ({
            value,
            label,
          }),
        });
      },
    },
    tagIds: {
      type: "string[]",
      label: "Tags",
      description: "Array of IDs of tags associated with the work item",
      optional: true,
      async options({ prevContext }) {
        return this.getPropOptions({
          prevContext,
          resourceFn: this.listTags,
          resourceKey: "tags",
          mapper: ({
            id: value, name: label,
          }) => ({
            value,
            label,
          }),
        });
      },
    },
    revOrgId: {
      type: "string",
      label: "Rev Organization",
      description: "The Rev organization that the ticket is associated with",
      optional: true,
      async options({ prevContext }) {
        return this.getPropOptions({
          prevContext,
          resourceFn: this.listRevOrgs,
          resourceKey: "rev_orgs",
          mapper: ({
            id: value, display_name: label,
          }) => ({
            value,
            label,
          }),
        });
      },
    },
    accountId: {
      type: "string",
      label: "Account",
      description: "The ID of the account that the opportunity is associated with",
      async options({ prevContext }) {
        return this.getPropOptions({
          prevContext,
          resourceFn: this.listAccounts,
          resourceKey: "accounts",
          mapper: ({
            id: value, display_name: label,
          }) => ({
            value,
            label,
          }),
        });
      },
    },
    worksType: {
      type: "string",
      label: "Type",
      description: "Filters for work of the provided types",
      optional: true,
      options: Object.values(constants.WORKS_TYPE),
    },
    priority: {
      type: "string",
      label: "Priority",
      description: "Priority of the work based upon impact and criticality",
      optional: true,
      options: Object.values(constants.PRIORITY),
    },
    title: {
      type: "string",
      label: "Title",
      description: "Title of the work object",
    },
    body: {
      type: "string",
      label: "Body",
      description: "Body of the work object",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.devrev.ai";
    },
    _headers() {
      return {
        "Authorization": `${this.$auth.personal_access_token}`,
      };
    },
    _makeRequest({
      $ = this,
      path,
      ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...args,
      });
    },
    async getPropOptions({
      prevContext, resourceFn, args = {}, resourceKey, mapper = (item) => item?.id,
    }) {
      if (prevContext?.cursor) {
        args = {
          ...args,
          params: {
            ...args.params,
            cursor,
          },
        };
      }
      const response = await resourceFn(args);
      const items = response[resourceKey];
      const cursor = response?.cursor;
      const options = items?.map(mapper) || [];
      return {
        options,
        context: {
          cursor,
        },
      };
    },
    createWebhook(args = {}) {
      return this._makeRequest({
        path: "/webhooks.create",
        method: "POST",
        ...args,
      });
    },
    deleteWebhook(args = {}) {
      return this._makeRequest({
        path: "/webhooks.delete",
        method: "POST",
        ...args,
      });
    },
    getTag(args = {}) {
      return this._makeRequest({
        path: "/tags.get",
        ...args,
      });
    },
    listParts(args = {}) {
      return this._makeRequest({
        path: "/parts.list",
        ...args,
      });
    },
    listUsers(args = {}) {
      return this._makeRequest({
        path: "/dev-users.list",
        ...args,
      });
    },
    listCustomSchemaFragments(args = {}) {
      return this._makeRequest({
        path: "/schemas.custom.list",
        ...args,
      });
    },
    listTags(args = {}) {
      return this._makeRequest({
        path: "/tags.list",
        ...args,
      });
    },
    listRevOrgs(args = {}) {
      return this._makeRequest({
        path: "/rev-orgs.list",
        ...args,
      });
    },
    listAccounts(args = {}) {
      return this._makeRequest({
        path: "/accounts.list",
        ...args,
      });
    },
    listWorks(args = {}) {
      return this._makeRequest({
        path: "/works.list",
        ...args,
      });
    },
    createOrUpdateCustomSchemaFragment(args = {}) {
      return this._makeRequest({
        path: "/schemas.custom.set",
        method: "POST",
        ...args,
      });
    },
    createComment(args = {}) {
      return this._makeRequest({
        path: "/timeline-entries.create",
        method: "POST",
        ...args,
      });
    },
    createWorks(args = {}) {
      return this._makeRequest({
        path: "/works.create",
        method: "POST",
        ...args,
      });
    },
  },
};
