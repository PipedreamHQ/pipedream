import activecampaign from "../../activecampaign.app.mjs";
import common from "../common/webhook.mjs";

export default {
  ...common,
  name: "New Deal Note (Instant)",
  key: "activecampaign-new-deal-note",
  description: "Emit new event each time a new note is added to a deal.",
  version: "0.0.7",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    deals: {
      propDefinition: [
        activecampaign,
        "deals",
      ],
    },
  },
  methods: {
    getEvents() {
      return [
        "deal_note_add",
      ];
    },
    isRelevant(body) {
      return this.deals?.length === 0 || this.deals?.includes(body["deal[id]"]);
    },
    getMeta(body) {
      const { date_time: dateTimeIso } = body;
      const ts = Date.parse(dateTimeIso);
      return {
        id: body["deal[id]"],
        summary: body["note[text]"],
        ts,
      };
    },
  },
};
