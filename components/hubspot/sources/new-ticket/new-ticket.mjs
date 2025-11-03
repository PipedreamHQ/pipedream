import {
  DEFAULT_LIMIT,
  DEFAULT_TICKET_PROPERTIES,
} from "../../common/constants.mjs";
import common from "../common/common.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "hubspot-new-ticket",
  name: "New Ticket",
  description: "Emit new event for each new ticket created.",
  version: "0.0.36",
  dedupe: "unique",
  type: "source",
  props: {
    ...common.props,
    info: {
      type: "alert",
      alertType: "info",
      content: `Properties:\n\`${DEFAULT_TICKET_PROPERTIES.join(", ")}\``,
    },
    properties: {
      propDefinition: [
        common.props.hubspot,
        "ticketProperties",
        () => ({
          excludeDefaultProperties: true,
        }),
      ],
      label: "Additional properties to retrieve",
    },
  },
  methods: {
    ...common.methods,
    getTs(ticket) {
      return Date.parse(ticket.createdAt);
    },
    generateMeta(ticket) {
      const {
        id, properties,
      } = ticket;
      const ts = this.getTs(ticket);
      return {
        id,
        summary: properties.subject,
        ts,
      };
    },
    isRelevant(ticket, createdAfter) {
      return this.getTs(ticket) > createdAfter;
    },
    getParams() {
      const { properties = [] } = this;
      return {
        data: {
          limit: DEFAULT_LIMIT,
          sorts: [
            {
              propertyName: "createdate",
              direction: "DESCENDING",
            },
          ],
          properties: [
            ...DEFAULT_TICKET_PROPERTIES,
            ...properties,
          ],
        },
        object: "tickets",
      };
    },
    async processResults(after, params) {
      await this.searchCRM(params, after);
    },
  },
  sampleEmit,
};
