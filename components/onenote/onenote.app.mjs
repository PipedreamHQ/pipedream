import { axios } from "@pipedream/platform";
import utils from "./common/utils.mjs";

export default {
  type: "app",
  app: "onenote",
  propDefinitions: {
    notebookId: {
      label: "Notebook ID",
      description: "The notebook ID, e.g. `1-ec21367d-3684-4072-bad8-31e4a03fc029`. Use **Search Notebooks** to find it (the `id` field).",
      type: "string",
      async options() {
        const { value: notebooks } = await this.getNotebooks();

        return notebooks.map((notebook) => ({
          label: notebook.displayName,
          value: notebook.id,
        }));
      },
    },
    sectionId: {
      label: "Section ID",
      description: "The section ID, e.g. `1-a745a153-ea3f-4b6e-8f16-9163bfe64932`. Use **Search Sections** to find it (the `id` field).",
      type: "string",
      async options() {
        const { value: sections } = await this.getSections();

        return sections.map((section) => ({
          label: section.displayName,
          value: section.id,
        }));
      },
    },
    pageId: {
      label: "Page ID",
      description: "The page ID, e.g. `1-922e4ff8076f49cc9487e4728297580a!128-d089bdb3-33b1-4eeb-af21-98e7157af301`. Use **Search Pages** to find it (the `id` field of each page).",
      type: "string",
      async options() {
        const { value: pages } = await this.getPages({
          params: {
            "$top": 100,
          },
        });
        return pages.map((page) => ({
          label: page.title,
          value: page.id,
        }));
      },
    },
    search: {
      type: "string",
      label: "Search",
      description: "Free-text search against the name. Case-insensitive substring match, e.g. `project`. Translated server-side to a `contains` filter, because the OneNote API does not support the `$search` query parameter.",
      optional: true,
    },
    filter: {
      type: "string",
      label: "Filter",
      description: "OData `$filter` expression, e.g. `isDefault eq true` or `createdDateTime gt 2026-01-01T00:00:00Z`. Combined with `search` using `and` when both are set. [See the documentation](https://learn.microsoft.com/en-us/graph/query-parameters?tabs=http#filter)",
      optional: true,
    },
    expand: {
      type: "string",
      label: "Expand",
      description: "Related resource to include inline in each result, e.g. `parentNotebook` (the allowed values depend on the action). Only one value is accepted.",
      optional: true,
    },
  },
  methods: {
    _oauthAccessToken() {
      return this.$auth.oauth_access_token;
    },
    _apiUrl() {
      return "https://graph.microsoft.com/v1.0";
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        ...args,
        headers: {
          ...args.headers,
          Authorization: `Bearer ${this._oauthAccessToken()}`,
        },
      });
    },
    async getNotebooks(args = {}) {
      return this._makeRequest({
        path: "/me/onenote/notebooks",
        ...args,
      });
    },
    async createNotebook(args = {}) {
      return this._makeRequest({
        path: "/me/onenote/notebooks",
        method: "post",
        ...args,
      });
    },
    async createSection({
      notebookId, ...args
    }) {
      return this._makeRequest({
        path: `/me/onenote/notebooks/${notebookId}/sections`,
        method: "post",
        ...args,
      });
    },
    async getSections(args = {}) {
      return this._makeRequest({
        path: "/me/onenote/sections",
        ...args,
      });
    },
    async getSectionPages({
      sectionId, ...args
    }) {
      return this._makeRequest({
        path: `/me/onenote/sections/${sectionId}/pages`,
        ...args,
      });
    },
    async _getAllSections($) {
      const sections = [];
      let response = await this.getSections({
        $,
      });
      sections.push(...(response.value ?? []));
      while (response["@odata.nextLink"]) {
        response = await this._makeRequest({
          $,
          path: "",
          url: response["@odata.nextLink"],
        });
        sections.push(...(response.value ?? []));
      }
      return sections;
    },
    /**
     * Lists pages. With `sectionId`, queries only that section. Otherwise tries the
     * account-wide endpoint and, if Graph rejects it with error 20266 (too many
     * sections), falls back to querying /sections/{id}/pages one section at a time,
     * as Microsoft recommends. `$top` caps the total pages returned in the fallback;
     * `$filter` and `$expand` are applied to each section query.
     */
    async getPages({
      sectionId, ...args
    } = {}) {
      if (sectionId) {
        return this.getSectionPages({
          sectionId,
          ...args,
        });
      }
      try {
        return await this._makeRequest({
          path: "/me/onenote/pages",
          ...args,
        });
      } catch (err) {
        if (!utils.isSectionLimitError(err)) throw err;
      }

      const {
        $, params = {},
      } = args;
      // Graph can't skip across sections, so `$skip` is applied here: collect
      // `skip + top` pages in order, then drop the first `skip`.
      const {
        "$skip": skip = 0, "$top": top, ...sectionParams
      } = params;
      const target = top
        ? top + skip
        : undefined;
      const sections = await this._getAllSections($);
      const pages = [];
      for (const section of sections) {
        if (target && pages.length >= target) break;
        const response = await this.getSectionPages({
          $,
          sectionId: section.id,
          params: {
            ...sectionParams,
            "$top": target
              ? target - pages.length
              : undefined,
          },
        });
        pages.push(...(response.value ?? []));
      }
      // Paging across sections can't be expressed as one Graph nextLink.
      return {
        value: pages.slice(skip),
      };
    },
    async getPage({
      pageId, ...args
    }) {
      return this._makeRequest({
        path: `/me/onenote/pages/${pageId}`,
        ...args,
      });
    },
    async getPageContent({
      pageId, includeIDs, ...args
    }) {
      return this._makeRequest({
        path: `/me/onenote/pages/${pageId}/content`,
        responseType: "text",
        ...args,
        params: {
          ...(args.params ?? {}),
          ...(includeIDs
            ? {
              includeIDs: "true",
            }
            : {}),
        },
      });
    },
    async createPage({
      sectionId, ...args
    }) {
      return this._makeRequest({
        path: `/me/onenote/sections/${sectionId}/pages`,
        method: "post",
        ...args,
      });
    },
  },
};
