import { axios } from "@pipedreamhq/platform";

export default {
  type: "app",
  app: "waiverfile",
  propDefinitions: {
    apiKey: {
      type: "string",
      label: "API Key",
      description: "Your WaiverFile API key",
      secret: true,
    },
    siteID: {
      type: "string",
      label: "Site ID",
      description: "The ID of your WaiverFile site",
    },
    targetUrl: {
      type: "string",
      label: "Target URL",
      description: "The URL to receive the webhook",
    },
    eventID: {
      type: "string",
      label: "Event ID",
      description: "The ID of the event to update",
    },
    categoryname: {
      type: "string",
      label: "Category Name",
      description: "The name of the event category",
    },
    description: {
      type: "string",
      label: "Description",
      description: "A brief description of the category",
    },
    parentid: {
      type: "string",
      label: "Parent ID",
      description: "The ID of the parent category (for sub-category creation)",
      optional: true,
    },
    startdate: {
      type: "string",
      label: "Start Date",
      description: "The start date of the event (for searching waivers)",
    },
    enddate: {
      type: "string",
      label: "End Date",
      description: "The end date of the event (for searching waivers)",
    },
    fullname: {
      type: "string",
      label: "Full Name",
      description: "The full name of the person (for searching waivers)",
      optional: true,
    },
    eventtitle: {
      type: "string",
      label: "Event Title",
      description: "The title of the event (for searching waivers)",
      optional: true,
    },
    eventname: {
      type: "string",
      label: "Event Name",
      description: "The name of the event to update",
    },
    eventdescription: {
      type: "string",
      label: "Event Description",
      description: "The description of the event to update",
    },
    date: {
      type: "string",
      label: "Date",
      description: "The date of the event to update",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.waiverfile.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.apiKey}`,
        },
      });
    },
    async subscribeNewWaiver() {
      return this._makeRequest({
        method: "POST",
        path: "/api/v1/subscribe/newwaiver",
        params: {
          targetUrl: this.targetUrl,
          apiKey: this.apiKey,
          siteID: this.siteID,
        },
      });
    },
    async subscribeNewEvent() {
      return this._makeRequest({
        method: "POST",
        path: "/api/v1/subscribe/newevent",
        params: {
          targetUrl: this.targetUrl,
          apiKey: this.apiKey,
          siteID: this.siteID,
        },
      });
    },
    async subscribeNewCheckin() {
      return this._makeRequest({
        method: "POST",
        path: "/api/v1/subscribe/newcheckin",
        params: {
          targetUrl: this.targetUrl,
          apiKey: this.apiKey,
          siteID: this.siteID,
        },
      });
    },
    async subscribeEditWaiver() {
      return this._makeRequest({
        method: "POST",
        path: "/api/v1/subscribe/editwaiver",
        params: {
          targetUrl: this.targetUrl,
          apiKey: this.apiKey,
          siteID: this.siteID,
        },
      });
    },
    async subscribeEditEvent() {
      return this._makeRequest({
        method: "POST",
        path: "/api/v1/subscribe/editevent",
        params: {
          targetUrl: this.targetUrl,
          apiKey: this.apiKey,
          siteID: this.siteID,
        },
      });
    },
    async subscribeEditCheckin() {
      return this._makeRequest({
        method: "POST",
        path: "/api/v1/subscribe/editcheckin",
        params: {
          targetUrl: this.targetUrl,
          apiKey: this.apiKey,
          siteID: this.siteID,
        },
      });
    },
    async createEventCategory() {
      return this._makeRequest({
        method: "POST",
        path: "/api/v1/InsertEventCategory",
        params: {
          name: this.categoryname,
          active: true,
          apiKey: this.apiKey,
          siteID: this.siteID,
        },
      });
    },
    async searchWaivers() {
      return this._makeRequest({
        method: "GET",
        path: "/api/v1/sampledata/newwaiver",
        params: {
          startdate: this.startdate,
          enddate: this.enddate,
          fullname: this.fullname,
          eventtitle: this.eventtitle,
          categoryname: this.categoryname,
          apiKey: this.apiKey,
          siteID: this.siteID,
        },
      });
    },
    async updateEvent() {
      return this._makeRequest({
        method: "POST",
        path: "/api/v1/UpdateEvent",
        params: {
          eventID: this.eventID,
          eventName: this.eventname,
          eventdescription: this.eventdescription,
          date: this.date,
          apiKey: this.apiKey,
          siteID: this.siteID,
        },
      });
    },
  },
};
