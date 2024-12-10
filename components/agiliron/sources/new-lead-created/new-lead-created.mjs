import constants from "../../common/constants.mjs";
import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "agiliron-new-lead-created",
  name: "New Lead Created",
  description: "Emit new event when a new lead is created in Agiliron.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFields() {
      return {
        date: "CreatedTime",
        id: "LeadId",
        ...constants.TYPE_FIELDS.Leads,
      };
    },
    getFunction() {
      return this.agiliron.getLeads;
    },
    getSummary(lead) {
      return `New lead: ${lead.FirstName} ${lead.LastName}`;
    },
  },
  sampleEmit,
};
