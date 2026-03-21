/**
 * ServiceM8 Pipedream app: OAuth, CRUD, webhooks, and messaging against the ServiceM8 API.
 * @module servicem8.app
 */
import { axios } from "@pipedream/platform";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const logic = require("./servicem8.app.logic.js");
const createMethods = require("./servicem8.methods.cjs");

/**
 * Build a prop definition that loads UUIDs for a ServiceM8 list resource via async options.
 * @param {string} resource - API resource segment (e.g. `job`, `companycontact`)
 * @param {string} label - UI label for the prop
 * @param {string} noun - Short noun for the description (e.g. `job`, `company`)
 * @returns {object} Pipedream prop definition with async options
 */
function makeResourceUuidProp(resource, label, noun) {
  return {
    type: "string",
    label,
    description: `Select a ${noun} or enter its UUID`,
    async options({
      $, prevContext,
    }) {
      return this._uuidOptionsForResource({
        $,
        resource,
        prevContext,
      });
    },
  };
}

export default {
  type: "app",
  app: "servicem8",
  propDefinitions: {
    ...logic.listQueryPropDefinitions,
    record: {
      type: "object",
      label: "Record",
      description: "JSON object of fields for the ServiceM8 API request body. Updates use POST (not PATCH); include the full set of fields to persist—omitted fields may be cleared.",
    },
    jobUuid: makeResourceUuidProp("job", "Job", "job"),
    companyUuid: makeResourceUuidProp("company", "Company", "company"),
    jobactivityUuid: makeResourceUuidProp("jobactivity", "Job Activity", "job activity"),
    jobpaymentUuid: makeResourceUuidProp("jobpayment", "Job Payment", "job payment"),
    categoryUuid: makeResourceUuidProp("category", "Category", "category"),
    jobmaterialUuid: makeResourceUuidProp("jobmaterial", "Job Material", "job material"),
    staffUuid: makeResourceUuidProp("staff", "Staff", "staff member"),
    badgeUuid: makeResourceUuidProp("badge", "Badge", "badge"),
    dboattachmentUuid: makeResourceUuidProp("dboattachment", "Attachment", "attachment"),
    companycontactUuid: makeResourceUuidProp("companycontact", "Company Contact", "company contact"),
    jobcontactUuid: makeResourceUuidProp("jobcontact", "Job Contact", "job contact"),
    noteUuid: makeResourceUuidProp("note", "Note", "note"),
    queueUuid: makeResourceUuidProp("queue", "Queue", "queue"),
    feedbackUuid: makeResourceUuidProp("feedback", "Feedback", "feedback item"),
  },
  methods: createMethods(axios),
};
