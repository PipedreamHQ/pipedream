import { axios } from "@pipedream/platform";

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
          valueKey: "id",
          labelKey: "title",
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
          valueKey: "id",
          labelKey: "name",
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
          valueKey: "id",
          labelKey: "full_name",
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
          valueKey: "id",
          labelKey: "display_id",
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
          valueKey: "id",
          labelKey: "name",
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
          valueKey: "id",
          labelKey: "display_name",
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
          valueKey: "id",
          labelKey: "display_name",
        });
      },
    },
    worksType: {
      type: "string",
      label: "Type",
      description: "Filters for work of the provided types",
      optional: true,
      options: [
        "issue",
        "opportunity",
        "task",
        "ticket",
      ],
    },
    priority: {
      type: "string",
      label: "Priority",
      description: "Priority of the work based upon impact and criticality",
      optional: true,
      options: [
        "p0",
        "p1",
        "p2",
        "p3",
      ],
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
      prevContext, resourceFn, args = {}, resourceKey, valueKey, labelKey,
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
      const options = items?.map((item) => ({
        value: item[valueKey],
        label: item[labelKey],
      })) || [];
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
