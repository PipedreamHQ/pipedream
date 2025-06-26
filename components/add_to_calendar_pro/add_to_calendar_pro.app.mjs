import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "add_to_calendar_pro",
  propDefinitions: {
    groupProKey: {
      type: "string",
      label: "Group Pro Key",
      description: "The pro key of a group",
      async options() {
        const groups = await this.listGroups();
        return groups?.map((group) => ({
          label: group.label,
          value: group.prokey,
        })) || [];
      },
    },
    styleId: {
      type: "string",
      label: "Style ID",
      description: "The ID of a style",
      optional: true,
      async options() {
        const styles = await this.listStyles();
        return styles?.map((style) => ({
          label: style.name,
          value: style.id,
        })) || [];
      },
    },
    landingPageTemplateId: {
      type: "string",
      label: "Landing Page Template ID",
      description: "The ID of a landing page template",
      optional: true,
      async options() {
        const templates = await this.listLandingPageTemplates();
        return templates?.map((template) => ({
          label: template.name,
          value: template.id,
        })) || [];
      },
    },
    eventProKey: {
      type: "string",
      label: "Event Pro Key",
      description: "The pro key of an event",
      async options() {
        const events = await this.listEvents();
        return events?.map((event) => ({
          label: event.label,
          value: event.prokey,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.add-to-calendar-pro.com/v1";
    },
    async _makeRequest({
      $ = this, path, ...opts
    }) {
      try {
        return await axios($, {
          url: `${this._baseUrl()}${path}`,
          headers: {
            Authorization: `${this.$auth.api_key}`,
          },
          ...opts,
        });
      } catch (error) {
        if (error.status === 404 && JSON.parse(error.message)?.message?.includes("No entry found")) {
          console.log("No entry found");
        } else {
          throw error;
        }
      }
    },
    getGroup({
      groupProKey, ...opts
    }) {
      return this._makeRequest({
        path: `/group/${groupProKey}`,
        ...opts,
      });
    },
    getEvent({
      eventProKey, ...opts
    }) {
      return this._makeRequest({
        path: `/event/${eventProKey}`,
        ...opts,
      });
    },
    getLandingPageTemplate({
      landingPageTemplateId, ...opts
    }) {
      return this._makeRequest({
        path: `/landingpage/${landingPageTemplateId}`,
        ...opts,
      });
    },
    getRsvpTemplate({
      rsvpTemplateId, ...opts
    }) {
      return this._makeRequest({
        path: `/rsvp-block/${rsvpTemplateId}`,
        ...opts,
      });
    },
    getIcsData({
      eventProKey, ...opts
    }) {
      return this._makeRequest({
        path: `/ics/${eventProKey}`,
        ...opts,
      });
    },
    listGroups(opts = {}) {
      return this._makeRequest({
        path: "/group/all",
        ...opts,
      });
    },
    listStyles(opts = {}) {
      return this._makeRequest({
        path: "/style/all",
        ...opts,
      });
    },
    listLandingPageTemplates(opts = {}) {
      return this._makeRequest({
        path: "/landingpage/all",
        ...opts,
      });
    },
    listEvents(opts = {}) {
      return this._makeRequest({
        path: "/event/all",
        ...opts,
      });
    },
    createGroup(opts = {}) {
      return this._makeRequest({
        path: "/group",
        method: "POST",
        ...opts,
      });
    },
    createEvent(opts = {}) {
      return this._makeRequest({
        path: "/event",
        method: "POST",
        ...opts,
      });
    },
    createLandingPageTemplate(opts = {}) {
      return this._makeRequest({
        path: "/landingpage",
        method: "POST",
        ...opts,
      });
    },
    createRsvpTemplate(opts = {}) {
      return this._makeRequest({
        path: "/rsvp-block",
        method: "POST",
        ...opts,
      });
    },
    updateGroup({
      groupProKey, ...opts
    }) {
      return this._makeRequest({
        path: `/group/${groupProKey}`,
        method: "PATCH",
        ...opts,
      });
    },
    updateEvent({
      eventProKey, ...opts
    }) {
      return this._makeRequest({
        path: `/event/${eventProKey}`,
        method: "PATCH",
        ...opts,
      });
    },
    updateLandingPageTemplate({
      landingPageTemplateId, ...opts
    }) {
      return this._makeRequest({
        path: `/landingpage/${landingPageTemplateId}`,
        method: "PATCH",
        ...opts,
      });
    },
    updateRsvpTemplate({
      rsvpTemplateId, ...opts
    }) {
      return this._makeRequest({
        path: `/rsvp-block/${rsvpTemplateId}`,
        method: "PATCH",
        ...opts,
      });
    },
    deleteGroup({
      groupProKey, ...opts
    }) {
      return this._makeRequest({
        path: `/group/${groupProKey}`,
        method: "DELETE",
        ...opts,
      });
    },
    deleteEvent({
      eventProKey, ...opts
    }) {
      return this._makeRequest({
        path: `/event/${eventProKey}`,
        method: "DELETE",
        ...opts,
      });
    },
    deleteLandingPageTemplate({
      landingPageTemplateId, ...opts
    }) {
      return this._makeRequest({
        path: `/landingpage/${landingPageTemplateId}`,
        method: "DELETE",
        ...opts,
      });
    },
    deleteRsvpTemplate({
      rsvpTemplateId, ...opts
    }) {
      return this._makeRequest({
        path: `/rsvp-block/${rsvpTemplateId}`,
        method: "DELETE",
        ...opts,
      });
    },
  },
};
