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
      async options() {
        const templates = await this.listLandingPageTemplates();
        return templates?.map((template) => ({
          label: template.name,
          value: template.id,
        })) || [];
      },
    },
    rsvpTemplateId: {
      type: "string",
      label: "RSVP Template ID",
      description: "The ID of an RSVP template",
      async options() {
        const templates = await this.listRsvpTemplates();
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
    eventName: {
      type: "string",
      label: "Name",
      description: "The name of the event",
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "The start date of the event in format YYYY-MM-DD",
    },
    startTime: {
      type: "string",
      label: "Start Time",
      description: "The start time of the event in format HH:MM",
      optional: true,
    },
    endDate: {
      type: "string",
      label: "End Date",
      description: "The end date of the event in format YYYY-MM-DD",
      optional: true,
    },
    endTime: {
      type: "string",
      label: "End Time",
      description: "The end time of the event in format HH:MM",
      optional: true,
    },
    timeZone: {
      type: "string",
      label: "Time Zone",
      description: "The timezone of the event. Example: `America/Los_Angeles`",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of the event",
      optional: true,
    },
    location: {
      type: "string",
      label: "Location",
      description: "The location of the event",
      optional: true,
    },
    rsvp: {
      type: "boolean",
      label: "RSVP",
      description: "Whether the event is an RSVP event",
      optional: true,
    },
    distribution: {
      type: "boolean",
      label: "Event Distribution",
      description: "Whether the event is distributed to all group members",
      optional: true,
    },
    hideButton: {
      type: "boolean",
      label: "Hide Button",
      description: "Whether the Add to Calendar button is hidden",
      optional: true,
    },
    cta: {
      type: "boolean",
      label: "Call to Action",
      description: "Whether the event has a call to action",
      optional: true,
    },
    landingPageTemplateName: {
      type: "string",
      label: "Name",
      description: "The name of the landing page template",
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title of the landing page template",
      optional: true,
    },
    intro: {
      type: "string",
      label: "Intro",
      description: "The intro of the landing page template",
      optional: true,
    },
    legal: {
      type: "string",
      label: "Legal",
      description: "The legal footer text; allows for HTML",
      optional: true,
    },
    highlightColor: {
      type: "string",
      label: "Highlight Color",
      description: "Hex code; used for buttons and decorative elements",
      optional: true,
    },
    backgroundColor1: {
      type: "string",
      label: "Background Color 1",
      description: "Hex code; used for the background of the template",
      optional: true,
    },
    backgroundColor2: {
      type: "string",
      label: "Background Color 2",
      description: "Hex code; used for the background of the template",
      optional: true,
    },
    background: {
      type: "string",
      label: "Background",
      description: "Background of the template",
      options: [
        "solid",
        "gradient",
        "image",
        "preset",
      ],
      optional: true,
    },
    gradientDirection: {
      type: "string",
      label: "Gradient Direction",
      description: "The direction of the gradient. Only used if `background` is `gradient`.",
      options: [
        "linear-t",
        "linear-tr",
        "linear-r",
        "linear-br",
        "radial",
      ],
      optional: true,
    },
    imageRepeat: {
      type: "boolean",
      label: "Image Repeat",
      description: "Whether to show the background image fullscreen or repeat it",
      optional: true,
    },
    metaTitleOverride: {
      type: "string",
      label: "Meta Title Override",
      description: "Text that overrides the auto-generated meta title",
      optional: true,
    },
    metaDescriptionOverride: {
      type: "string",
      label: "Meta Description Override",
      description: "Text that overrides the auto-generated meta description",
      optional: true,
    },
    eventGroupName: {
      type: "string",
      label: "Event Group Name",
      description: "The name of the event group",
    },
    internalNote: {
      type: "string",
      label: "Internal Note",
      description: "Internal note for the event group",
      optional: true,
    },
    subscriptionCallUrl: {
      type: "string",
      label: "Subscription Call URL",
      description: "URL to an external calendar. Needs to start with \"http\"! Usually ends with \".ics\"",
      optional: true,
    },
    rsvpTemplateName: {
      type: "string",
      label: "RSVP Template Name",
      description: "The name of the RSVP template",
    },
    rsvpTemplateMax: {
      type: "integer",
      label: "Max",
      description: "Max amount of seats; defaults to unlimited",
      optional: true,
    },
    rsvpTemplateMaxPP: {
      type: "integer",
      label: "Max Per Person",
      description: "Max seats per sign-up; defaults to 1",
      optional: true,
    },
    expires: {
      type: "string",
      label: "Expires",
      description: "an optional expiration date as ISO 8601 UTC datetime",
      optional: true,
    },
    maybeOption: {
      type: "boolean",
      label: "Maybe Option",
      description: "Whether to allow users to select a maybe option",
      optional: true,
    },
    initialConfirmation: {
      type: "boolean",
      label: "Initial Confirmation",
      description: "If `true`, the initial sign-up will always be \"confirmed\"",
      optional: true,
    },
    doi: {
      type: "boolean",
      label: "DOI",
      description: "If `true`, each user will need to confirm his email",
      optional: true,
    },
    headline: {
      type: "string",
      label: "Headline",
      description: "The headline of the RSVP template",
      optional: true,
    },
    text: {
      type: "string",
      label: "Text",
      description: "The text of the RSVP template",
      optional: true,
    },
    fields: {
      type: "string[]",
      label: "Fields",
      description: "The fields of the RSVP template. Example: `[{ \"type\": \"text\", \"name\": \"additional_info\", \"label\": \"Additional note\", \"required\": false, \"placeholder\": \"Type here...\", \"default\": \"Call me maybe\" }]` [See the documentation](https://docs.add-to-calendar-pro.com/api/rsvp#add-an-rsvp-template) for more information.",
      optional: true,
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
          return null;
        } else {
          throw error;
        }
      }
    },
    createWebhook(opts = {}) {
      return this._makeRequest({
        path: "/webhook",
        method: "POST",
        ...opts,
      });
    },
    deleteWebhook({
      hookId, ...opts
    }) {
      return this._makeRequest({
        path: `/webhook/${hookId}`,
        method: "DELETE",
        ...opts,
      });
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
    listRsvpTemplates(opts = {}) {
      return this._makeRequest({
        path: "/rsvp-block/all",
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
