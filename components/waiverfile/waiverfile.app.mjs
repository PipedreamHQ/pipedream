import { axios } from "@pipedreamhq/platform";

export default {
  type: "app",
  app: "waiverfile",
  propDefinitions: {
    eventId: {
      type: "string",
      label: "Event ID",
      description: "The ID of the upcoming event to update",
      async options() {
        const response = await this.listUpcomingEvents({
          params: {
            startDateUTC: new Date(),
            endDateUTC: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
          },
        });
        const events = JSON.parse(response);
        return events?.map(({
          WaiverEventID: value, Name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    categoryId: {
      type: "string",
      label: "Event Category ID",
      description: "The ID of the new event category",
      async options() {
        const categories = await this.listEventCategories({
          params: {
            includeDisabledCategories: false,
          },
        });
        return categories?.map((category) => ({
          value: category.me.iD,
          label: category.me.name,
        })) || [];
      },
    },
    waiverFormIds: {
      type: "string[]",
      label: "Waiver Form IDs",
      description: "List of Waiver Form ID's for this event. Leave empty to attach all active forms.",
      async options() {
        const waiverForms = await this.listWaiverForms();
        return waiverForms?.map((form) => ({
          value: form.me.iD,
          label: form.me.name,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.waiverfile.com/api/v1";
    },
    _params(params) {
      return {
        ...params,
        apiKey: `${this.$auth.site_key}`,
        siteID: `${this.$auth.site_id}`,
      };
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
        params: this._params(params),
      });
    },
    createWebhook({
      eventType, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/subscribe/${eventType}`,
        ...opts,
      });
    },
    deleteWebhook({
      eventType, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/deletesubscribe/${eventType}`,
        ...opts,
      });
    },
    listWaiverForms(opts = {}) {
      return this._makeRequest({
        path: "/GetAllWaiverForms",
        ...opts,
      });
    },
    listUpcomingEvents(opts = {}) {
      return this._makeRequest({
        path: "/GetUpcomingEvents",
        ...opts,
      });
    },
    listEventCategories(opts = {}) {
      return this._makeRequest({
        path: "/GetEventCategories",
        ...opts,
      });
    },
    createEventCategory(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/InsertEventCategory",
        ...opts,
      });
    },
    searchWaivers(opts = {}) {
      return this._makeRequest({
        path: "/SearchWaivers",
        ...opts,
      });
    },
    updateEvent(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/UpdateEvent",
        ...opts,
      });
    },
  },
};
