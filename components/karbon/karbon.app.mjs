import { axios } from "@pipedream/platform";

const MAX_PAGE_SIZE = 100;

export default {
  type: "app",
  app: "karbon",
  propDefinitions: {
    contactKey: {
      type: "string",
      label: "Contact Key",
      description: "The Karbon key of the contact, e.g. `2nvhdM1TmZk3`. Use **List Contacts** to find it (the `ContactKey` field).",
      async options({ prevContext }) {
        return this._keyOptions({
          fn: this.listContacts,
          prevContext,
          toOption: ({
            ContactKey: value, FullName: label,
          }) => ({
            label,
            value,
          }),
        });
      },
    },
    workItemKey: {
      type: "string",
      label: "Work Item Key",
      description: "The Karbon key of the work item, e.g. `2y7H6dhQL7mD`. Use **List Work Items** to find it (the `WorkItemKey` field).",
      async options({ prevContext }) {
        return this._keyOptions({
          fn: this.listWorkItems,
          prevContext,
          toOption: ({
            WorkItemKey: value, Title: label,
          }) => ({
            label,
            value,
          }),
        });
      },
    },
    filter: {
      type: "string",
      label: "Filter",
      description: "An OData filter expression, e.g. `FullName eq 'Sample Company'`.",
      optional: true,
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The most records to return, e.g. `50`. Defaults to `100`.",
      default: 100,
      min: 1,
      optional: true,
    },
  },
  methods: {
    _makeRequest({
      $ = this, headers, ...args
    }) {
      return axios($, {
        baseURL: "https://api.karbonhq.com/v3",
        headers: {
          Authorization: `Bearer ${this.$auth.application_access_key}`,
          AccessKey: this.$auth.tenant_access_key,
          ...headers,
        },
        ...args,
      });
    },
    // The platform's axios breaks an absolute `url` when `baseURL` is set, so the query of
    // `@odata.nextLink` is sent as params against the same relative path.
    _nextParams(params, nextLink) {
      return nextLink
        ? {
          ...params,
          ...Object.fromEntries(new URL(nextLink).searchParams),
        }
        : null;
    },
    async _keyOptions({
      fn, prevContext, toOption,
    }) {
      if (prevContext?.done) {
        return [];
      }
      const params = prevContext?.params ?? {
        $top: MAX_PAGE_SIZE,
      };
      const {
        value, "@odata.nextLink": nextLink,
      } = await fn.call(this, {
        params,
      });
      const nextParams = this._nextParams(params, nextLink);
      return {
        options: value.map(toOption),
        context: nextParams
          ? {
            params: nextParams,
          }
          : {
            done: true,
          },
      };
    },
    /**
     * Fetch records across pages, up to a limit.
     * @param {object} opts
     * @param {function} opts.fn - The list method to call
     * @param {object} [opts.params] - Query params for the first request
     * @param {number} [opts.maxResults=100] - The most records to return
     * @returns {Promise<object[]>} The records
     */
    async paginate({
      fn, params, maxResults = 100, ...args
    }) {
      const records = [];
      let nextParams = {
        ...params,
        $top: Math.min(maxResults, MAX_PAGE_SIZE),
      };
      while (nextParams && records.length < maxResults) {
        const {
          value, "@odata.nextLink": nextLink,
        } = await fn.call(this, {
          ...args,
          params: nextParams,
        });
        records.push(...value);
        nextParams = this._nextParams(nextParams, nextLink);
      }
      return records.slice(0, maxResults);
    },
    /**
     * Fetch one page of contacts.
     * @param {object} [args] - Request options, such as `$` and `params`
     * @returns {Promise<object>} The page, with records in `value`
     */
    listContacts(args = {}) {
      return this._makeRequest({
        url: "/Contacts",
        ...args,
      });
    },
    /**
     * Fetch one contact.
     * @param {object} opts
     * @param {string} opts.contactKey - The contact key
     * @returns {Promise<object>} The contact
     */
    getContact({
      contactKey, ...args
    }) {
      return this._makeRequest({
        url: `/Contacts/${contactKey}`,
        ...args,
      });
    },
    /**
     * Fetch one page of organizations.
     * @param {object} [args] - Request options, such as `$` and `params`
     * @returns {Promise<object>} The page, with records in `value`
     */
    listOrganizations(args = {}) {
      return this._makeRequest({
        url: "/Organizations",
        ...args,
      });
    },
    /**
     * Fetch one page of work items.
     * @param {object} [args] - Request options, such as `$` and `params`
     * @returns {Promise<object>} The page, with records in `value`
     */
    listWorkItems(args = {}) {
      return this._makeRequest({
        url: "/WorkItems",
        ...args,
      });
    },
    /**
     * Fetch one work item.
     * @param {object} opts
     * @param {string} opts.workItemKey - The work item key
     * @returns {Promise<object>} The work item
     */
    getWorkItem({
      workItemKey, ...args
    }) {
      return this._makeRequest({
        url: `/WorkItems/${workItemKey}`,
        ...args,
      });
    },
    /**
     * Fetch one page of users.
     * @param {object} [args] - Request options, such as `$` and `params`
     * @returns {Promise<object>} The page, with records in `value`
     */
    listUsers(args = {}) {
      return this._makeRequest({
        url: "/Users",
        ...args,
      });
    },
    /**
     * Create a note.
     * @param {object} [args] - Request options, with the note in `data`
     * @returns {Promise<object>} The created note
     */
    createNote(args = {}) {
      return this._makeRequest({
        method: "POST",
        url: "/Notes",
        ...args,
      });
    },
  },
};
