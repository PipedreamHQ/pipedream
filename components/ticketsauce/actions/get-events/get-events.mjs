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
      propDefinition: [
        ticketsauce,
        "partnerId",
      ],
    },
    organizationId: {
      propDefinition: [
        ticketsauce,
        "organizationId",
      ],
    },
    startAfter: {
      type: "string",
      label: "Start After",
      description: "Only retrieve events that start AFTER the specified UTC date (format: `YYYY-MM-DD`).",
      optional: true,
    },
    endBefore: {
      type: "string",
      label: "End Before",
      description: "Only retrieve events that end BEFORE the specified UTC date (format: `YYYY-MM-DD`).",
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
      description: "Filter events by privacy type.",
      optional: true,
      default: "public",
      options: [
        {
          label: "Public events only",
          value: "public",
        },
        {
          label: "All events (no restriction)",
          value: "all",
        },
        {
          label: "Unlisted events only",
          value: "unlisted",
        },
      ],
    },
    sortBy: {
      type: "string",
      label: "Sort By",
      description: "Field to sort events by.",
      optional: true,
      options: [
        {
          label: "Event start date",
          value: "date",
        },
        {
          label: "Event name",
          value: "name",
        },
        {
          label: "City location",
          value: "city",
        },
      ],
    },
    sortDir: {
      type: "string",
      label: "Sort Direction",
      description: "Direction to sort results.",
      optional: true,
      options: [
        {
          label: "Ascending",
          value: "asc",
        },
        {
          label: "Descending",
          value: "desc",
        },
      ],
    },
    includePerformers: {
      propDefinition: [
        ticketsauce,
        "includePerformers",
      ],
    },
  },
  async run({ $ }) {
    const params = {
      partner_id: this.partnerId,
      organization_id: this.organizationId,
      start_after: this.startAfter,
      end_before: this.endBefore,
      active_only: String(this.activeOnly),
      privacy_type: this.privacyType,
      sort_by: this.sortBy,
      sort_dir: this.sortDir,
      include_performers: String(this.includePerformers),
    };
    return this.ticketsauce.listEvents($, {
      params,
    });
  },
};
