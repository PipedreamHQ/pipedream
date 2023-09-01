import {
  axios,
  DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";

export default {
  key: "a123formbuilder-form-response-submitted",
  name: "Form Response Submitted",
  description: "Emit new event for every submitted form response",
  type: "source",
  version: "0.0.2",
  dedupe: "unique",
  props: {
    a123formbuilder: {
      type: "app",
      app: "a123formbuilder",
    },
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    form: {
      type: "integer",
      label: "Form",
      description: "The id of a form",
      async options({ prevContext }) {
        const response = await this.getForms({
          params: {
            limit: 10,
            page: prevContext?.nextPage,
          },
        });
        return {
          options: response.data.map((form) => ({
            label: form.name,
            value: form.id,
          })),
          context: {
            nextPage: this.getCurrentPage(response) + 1,
          },
        };
      },
    },
  },
  methods: {
    _baseUrl() {
      return `https://${this._region()}.123formbuilder.com/v2`;
    },
    _region() {
      return this.a123formbuilder.$auth.region;
    },
    _auth() {
      return this.a123formbuilder.$auth.oauth_access_token;
    },
    getCurrentPage(response) {
      return response.meta.pagination.current_page;
    },
    isLastPage(response) {
      return this.getCurrentPage(response) === response.meta.pagination.total_pages;
    },
    async _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        ...opts,
        url: this._baseUrl() + path,
        params: {
          ...opts.params,
          JWT: this._auth(),
        },
      });
    },
    async getForms({
      paginate = false, ...opts
    }) {
      if (paginate) {
        return this.paginate({
          ...opts,
          fn: this.getForms,
        });
      }
      return this._makeRequest({
        ...opts,
        path: "/forms",
      });
    },
    async getFormResponses({
      paginate = false, form, ...opts
    }) {
      if (paginate) {
        return this.paginate({
          ...opts,
          fn: this.getFormResponses,
          form,
        });
      }
      return this._makeRequest({
        ...opts,
        path: `/forms/${form}/submissions`,
      });
    },
    async paginate({
      fn, ...opts
    }) {
      const data = [];
      opts.params = {
        ...opts.params,
        per_page: 1000,
        page: 1,
      };

      while (true) {
        const response = await fn.call(this, opts);
        data.push(...response.data);
        opts.params.page++;

        if (this.isLastPage(response)) {
          return {
            data,
            meta: response.meta,
          };
        }
      }
    },
    getPage() {
      return this.db.get("page") || 1;
    },
    setPage(page) {
      this.db.set("page", page);
    },
    getEmittedIds() {
      return new Set(this.db.get("emittedIds") || []);
    },
    setEmittedIds(ids) {
      this.db.set("emittedIds", Array.from(ids));
    },
    getMeta(formResponse) {
      return {
        id: formResponse.id,
        summary: `New form response with id ${formResponse.id}`,
        ts: new Date(formResponse.date),
      };
    },
    listingFn() {
      return this.getFormResponses;
    },
    listingFnParams() {
      return {
        form: this.form,
      };
    },
  },
  async run() {
    const page = this.getPage();
    const emittedIds = this.getEmittedIds();
    const response = await this.listingFn()({
      ...this.listingFnParams(),
      paginate: true,
      params: {
        page,
      },
    });
    this.setPage(this.getCurrentPage(response));
    response.data.forEach((form) => {
      if (!emittedIds.has(form.id)) {
        this.$emit(form, this.getMeta(form));
        emittedIds.add(form.id);
      }
    });
    this.setEmittedIds(emittedIds);
  },
};
