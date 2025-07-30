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
      type: "integer",
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
      type: "integer",
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
      type: "integer",
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
    ctaTemplateId: {
      type: "integer",
      label: "CTA Template ID",
      description: "The ID of a Call to Action template",
      async options() {
        const templates = await this.listCtaTemplates();
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
    customDomainId: {
      type: "integer",
      label: "Custom Domain ID",
      description: "The ID of a custom domain",
      async options() {
        const { available_custom_domains: domains } = await this.listCustomDomains();
        return domains?.map((domain) => ({
          label: domain.host,
          value: domain.id,
        })) || [];
      },
    },
    emailTemplateId: {
      type: "integer",
      label: "Email Template ID",
      description: "The ID of an email template",
      optional: true,
      async options({ type }) {
        const templates = await this.listEmailTemplates({
          type,
        });
        return templates?.map((template) => ({
          label: template.name,
          value: template.id,
        })) || [];
      },
    },
    titleEventSeries: {
      type: "string",
      label: "Title Event Series",
      description: "The title of the event series",
      optional: true,
    },
    simplifiedRecurrence: {
      type: "boolean",
      label: "Simplified Recurrence",
      description: "Set false, if you go for the \"recurrence\" field, which takes an RRULE; and true if you use the other recurrence fields",
      optional: true,
    },
    recurrence: {
      type: "string",
      label: "Recurrence",
      description: "An RRULE. Use in combination with \"Simplified Recurrence\" being set to false.",
      optional: true,
    },
    recurrenceSimpleType: {
      type: "string",
      label: "Recurrence Simple Type",
      description: "Use in combination with \"Simplified Recurrence\" being set to true.",
      options: [
        "daily",
        "weekly",
        "monthly",
        "yearly",
      ],
      optional: true,
    },
    recurrenceInterval: {
      type: "integer",
      label: "Recurrence Interval",
      description: "The interval of the recurrence",
      optional: true,
    },
    recurrenceByDay: {
      type: "string",
      label: "Recurrence By Day",
      description: "Example: `2MO,TU` for the second Monday and each Tuesday",
      optional: true,
    },
    recurrenceByMonth: {
      type: "string",
      label: "Recurrence By Month",
      description: "Example: `1,2,12` for Jan, Feb, and Dec",
      optional: true,
    },
    recurrenceByMonthDay: {
      type: "string",
      label: "Recurrence By Month Day",
      description: "Example: `3,23` for the 3rd and 23rd day of the month",
      optional: true,
    },
    recurrenceCount: {
      type: "integer",
      label: "Recurrence Count",
      description: "The count of the recurrence",
      optional: true,
    },
    recurrenceWeekStart: {
      type: "string",
      label: "Recurrence Week Start",
      description: "The week start of the recurrence. Example: `MO` for Monday",
      optional: true,
    },
    iCalFileName: {
      type: "string",
      label: "iCal File Name",
      description: "Overriding the ics file name",
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
    metaRobotsOverride: {
      type: "boolean",
      label: "Meta Robots Override",
      description: "If true, Add to Calendar Pro will set \"norobots, noindex\"",
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
    subscriptionCalUrl: {
      type: "string",
      label: "Subscription Cal URL",
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
    listCtaTemplates(opts = {}) {
      return this._makeRequest({
        path: "/cta-block/all",
        ...opts,
      });
    },
    listCustomDomains(opts = {}) {
      return this._makeRequest({
        path: "/custom-domains",
        ...opts,
      });
    },
    listEmailTemplates({
      type, ...opts
    }) {
      return this._makeRequest({
        path: `/email-template/${type}`,
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
