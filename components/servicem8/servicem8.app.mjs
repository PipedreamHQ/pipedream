/**
 * ServiceM8 Pipedream app: OAuth, CRUD, webhooks, and messaging against the ServiceM8 API.
 * @module servicem8.app
 */
import { axios } from "@pipedream/platform";
import * as logic from "./common/logic.mjs";
import { createMethods } from "./common/methods.mjs";
import {
  bodyFromFields, buildUpdateBody,
} from "./common/payload.mjs";

function uuidPropDefinition(resource) {
  const {
    label, noun,
  } = logic.RESOURCES[resource] ?? {
    label: resource,
    noun: resource,
  };
  return {
    type: "string",
    label,
    description:
      `Pick a ${noun} from the dropdown (type to search) or paste a UUID.`,
    useQuery: true,
    async options({
      $, prevContext, query,
    }) {
      return this.servicem8._uuidOptionsForResource({
        $: $ ?? this,
        resource,
        prevContext,
        query,
      });
    },
  };
}

/** Common company billing / invoicing dropdown values (API accepts string). */
const BILLING_ATTENTION_OPTIONS = [
  "Accounts",
  "Accounts Payable",
  "Managing Director",
  "Office Manager",
  "Primary Contact",
];

const PAYMENT_TERMS_OPTIONS = [
  "Due on receipt",
  "7 days",
  "14 days",
  "21 days",
  "30 days",
  "60 days",
  "90 days",
  "End of month",
  "COD",
];

/** Company contact `type` / role (see ServiceM8 company contact docs). */
const COMPANY_CONTACT_ROLE_OPTIONS = [
  "BILLING",
  "JOB",
  "Property Manager",
];

export default {
  type: "app",
  app: "servicem8",
  propDefinitions: {
    ...logic.listQueryPropDefinitions,
    badgeUuid: uuidPropDefinition("badge"),
    categoryUuid: uuidPropDefinition("category"),
    staffUuid: uuidPropDefinition("staff"),
    jobUuid: uuidPropDefinition("job"),
    companyUuid: uuidPropDefinition("company"),
    companyContactUuid: uuidPropDefinition("companycontact"),
    jobContactUuid: uuidPropDefinition("jobcontact"),
    jobActivityUuid: uuidPropDefinition("jobactivity"),
    jobMaterialUuid: uuidPropDefinition("jobmaterial"),
    jobPaymentUuid: uuidPropDefinition("jobpayment"),
    queueUuid: uuidPropDefinition("queue"),
    noteUuid: uuidPropDefinition("note"),
    dboattachmentUuid: uuidPropDefinition("dboattachment"),
    feedbackUuid: uuidPropDefinition("feedback"),
    taxRateUuid: uuidPropDefinition("taxrate"),
    billingAttention: {
      type: "string",
      label: "Billing Attention",
      optional: true,
      description: "Who invoices should be addressed to.",
      options: BILLING_ATTENTION_OPTIONS,
    },
    paymentTerms: {
      type: "string",
      label: "Payment Terms",
      optional: true,
      description: "When payment is due.",
      options: PAYMENT_TERMS_OPTIONS,
    },
    companyContactRole: {
      type: "string",
      label: "Role",
      optional: true,
      description: "How this contact is used (e.g. billing vs job site).",
      options: COMPANY_CONTACT_ROLE_OPTIONS,
    },
  },
  methods: (() => {
    const base = createMethods(axios);
    const resourceToName = {
      badge: "Badge",
      category: "Category",
      queue: "Queue",
      staff: "Staff",
      job: "Job",
      company: "Company",
      companycontact: "CompanyContact",
      jobcontact: "JobContact",
      jobactivity: "JobActivity",
      jobmaterial: "JobMaterial",
      jobpayment: "JobPayment",
      note: "Note",
      dboattachment: "Dboattachment",
    };
    const methods = {
      ...base,
    };
    for (const [
      resource,
      name,
    ] of Object.entries(resourceToName)) {
      methods[`create${name}`] = function ({
        $, data,
      }) {
        return this.createResource({
          $,
          resource,
          data: bodyFromFields(data),
        });
      };
      methods[`update${name}`] = async function ({
        $, uuid, data,
      }) {
        const merged = await buildUpdateBody(this, {
          $,
          resource,
          uuid,
          fields: bodyFromFields(data),
        });
        return this.updateResource({
          $,
          resource,
          uuid,
          data: merged,
        });
      };
    }
    return methods;
  })(),
};
