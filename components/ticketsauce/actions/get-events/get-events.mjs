import ticketsauce from "../../ticketsauce.app.mjs";

export default {
  key: "ticketsauce-get-events",
  name: "Get Events",
  description: "Get a list of all events owned by the authenticated account. [See documentation](https://speca.io/ticketsauce/ticketsauce-public-api?key=204000d6bda66da78315e721920f43aa#list-of-events)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    ticketsauce,
    partnerId: {
      type: "string",
      label: "Partner ID",
      description: "Including this ID will limit the result set to the specific partner.",
      optional: true,
    },
    organizationId: {
      type: "string",
      label: "Organization ID",
      description: "Including this ID will limit the result set to the specific organization.",
      optional: true,
    },
    startAfter: {
      type: "string",
      label: "Start After",
      description: "Only retrieve events that start AFTER the specified UTC date (format: YYYY-MM-DD).",
      optional: true,
    },
    endBefore: {
      type: "string",
      label: "End Before",
      description: "Only retrieve events that end BEFORE the specified UTC date (format: YYYY-MM-DD).",
      optional: true,
    },
    activeOnly: {
      type: "boolean",
      label: "Active Only",
      description: "Leaving this as true will restrict retrieved events to only 'active' events. Setting to false will allow the retrieval of both active and inactive events.",
      optional: true,
      default: true,
    },
    privacyType: {
      type: "string",
      label: "Privacy Type",
      description: "By default, this will restrict events to only those that are public. Changing to 'all' will remove all restriction, or changing to 'unlisted' will make it only pull those events that are set to unlisted.",
      optional: true,
      default: "public",
      options: [
        "public",
        "all",
        "unlisted",
      ],
    },
    sortBy: {
      type: "string",
      label: "Sort By",
      description: "Which field to sort by. By default ('date'), will sort events by their start date. Other options are 'name' (event name) or 'city' (the city where the event is located).",
      optional: true,
      options: [
        "date",
        "name",
        "city",
      ],
    },
    sortDir: {
      type: "string",
      label: "Sort Direction",
      description: "Which direction you'd like to sort - either ascending ('asc' - the default) or descending ('desc').",
      optional: true,
      options: [
        "asc",
        "desc",
      ],
    },
    includePerformers: {
      type: "boolean",
      label: "Include Performers",
      description: "Returns any associated performers/artists with an event",
      optional: true,
    },
  },
  async run() {
    const params = {
      partner_id: this.partnerId,
      organization_id: this.organizationId,
      start_after: this.startAfter,
      end_before: this.endBefore,
      active_only: this.activeOnly,
      privacy_type: this.privacyType,
      sort_by: this.sortBy,
      sort_dir: this.sortDir,
      include_performers: this.includePerformers,
    };

    return this.ticketsauce.listEvents({
      params,
    });
  },
};
