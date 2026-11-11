import common from "./base.mjs";

export default {
  ...common,
  props: {
    ...common.props,
    highlights: {
      propDefinition: [
        common.props.grain,
        "highlights",
      ],
    },
    participants: {
      propDefinition: [
        common.props.grain,
        "participants",
      ],
    },
    calendarEvent: {
      propDefinition: [
        common.props.grain,
        "calendarEvent",
      ],
    },
    hubspot: {
      propDefinition: [
        common.props.grain,
        "hubspot",
      ],
    },
    aiActionItems: {
      propDefinition: [
        common.props.grain,
        "aiActionItems",
      ],
    },
    aiSummary: {
      propDefinition: [
        common.props.grain,
        "aiSummary",
      ],
    },
  },
  methods: {
    ...common.methods,
    getInclude() {
      const include = {
        highlights: this.highlights,
        participants: this.participants,
        calendar_event: this.calendarEvent,
        hubspot: this.hubspot,
        ai_action_items: this.aiActionItems,
        ai_summary: this.aiSummary,
      };
      return Object.fromEntries(Object.entries(include).filter(([
        , value,
      ]) => value));
    },
    getTimestamp({ data }) {
      const ts = Date.parse(data.end_datetime);
      return Number.isNaN(ts)
        ? Date.now()
        : ts;
    },
  },
};
