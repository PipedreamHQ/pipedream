import activecampaign from "../../activecampaign.app.mjs";
import common from "../common/webhook.mjs";

export default {
  ...common,
  name: "New Event (Instant)",
  key: "activecampaign-new-event",
  description:
    "Emit new event for the specified event type from ActiveCampaign.",
  version: "0.0.6",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    eventType: {
      propDefinition: [
        activecampaign,
        "eventType",
      ],
    },
  },
  methods: {
    ...common.methods,
    getEvents() {
      return [
        this.eventType,
      ];
    },
    getMeta(body) {
      const { date_time: dateTimeIso } = body;
      const ts = Date.parse(dateTimeIso);
      return {
        id: body.date_time,
        summary: `${body.type} initiated by ${body.initiated_by}`,
        ts,
      };
    },
  },
};
