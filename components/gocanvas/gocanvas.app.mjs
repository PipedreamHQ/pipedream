import { axios } from "@pipedream/platform";
import xml2js from "xml2js";

export default {
  type: "app",
  app: "gocanvas",
  propDefinitions: {
    form: {
      type: "string",
      label: "Form",
      description: "The identifier of a form",
      async options() {
        const forms = await this.listForms();
        return forms?.map((form) => form.Name[0]) || [];
      },
    },
    dispatchId: {
      type: "string",
      label: "Dispatch ID",
      description: "Identifier of a dispatch",
      async options({
        page, form,
      }) {
        const dispatches = await this.getActiveDispatches({
          form,
          data: {
            page: page + 1,
          },
        });
        return dispatches?.map(({
          $, Description: desc,
        }) => ({
          value: $.Id,
          label: desc[0],
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://www.gocanvas.com/apiv2/";
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        params,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
        params: {
          ...params,
          username: `${this.$auth.username}`,
        },
        headers: {
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
      });
    },
    async getActiveDispatches({
      form, ...opts
    }) {
      const response = await this._makeRequest({
        path: "/dispatch_export",
        ...opts,
      });
      const { CanvasResult: { Dispatches: dispatches } } = await new xml2js
        .Parser().parseStringPromise(response);
      if (!dispatches?.length) {
        return [];
      }
      return dispatches
        .flatMap((d) => d.Dispatch || [])
        .filter((d) => d.Status[0] !== "deleted")
        .filter((d) => !form || d.Form[0] === form);
    },
    async listForms(opts = {}) {
      const response = await this._makeRequest({
        path: "/forms",
        ...opts,
      });
      const { CanvasResult: { Forms: forms } } = await new xml2js
        .Parser().parseStringPromise(response);
      if (!forms?.length) {
        return [];
      }
      return forms.flatMap((form) => form.Form || []);
    },
    async listSubmissions(opts = {}) {
      const response = await this._makeRequest({
        path: "/submissions",
        ...opts,
      });
      const { CanvasResult: { Submissions: submissions } } = await new xml2js
        .Parser().parseStringPromise(response);
      if (!submissions?.length) {
        return [];
      }
      return submissions.flatMap((sub) => sub.Submission || []);
    },
    async getDispatchDescription({
      dispatchId, ...opts
    }) {
      const dispatches = await this.getActiveDispatches({
        ...opts,
      });
      const dispatch = dispatches.find(({ $ }) => $.Id === dispatchId);
      return dispatch.Description[0];
    },
    dispatchItems(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/dispatch_items",
        ...opts,
      });
    },
    createUpdateReferenceData(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/reference_datas",
        ...opts,
      });
    },
    async *paginate({
      fn,
      params,
      max,
    }) {
      params = {
        ...params,
        page: 1,
      };
      let total, count = 0;
      do {
        const results = await fn({
          params,
        });
        for (const item of results) {
          yield item;
          if (max && ++count >= max) {
            return;
          }
        }
        total = results?.length;
        params.page++;
      } while (total);
    },
  },
};
