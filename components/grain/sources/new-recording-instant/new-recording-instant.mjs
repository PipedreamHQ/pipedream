import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "grain-new-recording-instant",
  name: "New Recording (Instant)",
  description: "Emit new event when a recording is added. [See the documentation](https://developers.grain.com)",
  version: "1.0.0",
  type: "source",
  dedupe: "unique",
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
    getHookType() {
      return "recording_added";
    },
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
    getSummary({ data }) {
      return `New recording added: ${data.id}`;
    },
  },
  sampleEmit,
};
