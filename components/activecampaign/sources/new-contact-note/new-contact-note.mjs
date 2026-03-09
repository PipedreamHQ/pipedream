import activecampaign from "../../activecampaign.app.mjs";
import common from "../common/webhook.mjs";

export default {
  ...common,
  name: "New Contact Note (Instant)",
  key: "activecampaign-new-contact-note",
  description: "Emit new event each time a new note is added to a contact.",
  version: "0.0.7",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    contacts: {
      propDefinition: [
        activecampaign,
        "contacts",
      ],
    },
  },
  methods: {
    getEvents() {
      return [
        "subscriber_note",
      ];
    },
    isRelevant(body) {
      return (
        this.contacts?.length === 0 ||
        this.contacts?.includes(body["contact[id]"])
      );
    },
    getMeta(body) {
      const { date_time: dateTimeIso } = body;
      const ts = Date.parse(dateTimeIso);
      return {
        id: `${body["contact[id]"]}${new Date(body.date_time).getTime()}`,
        summary: body.note,
        ts,
      };
    },
  },
};
