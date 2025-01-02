import alegra from "../../alegra.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "alegra-create-invoice",
  name: "Create Invoice",
  description: "Creates a new invoice in Alegra. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    alegra,
    items: {
      propDefinition: [
        "alegra",
        "items",
      ],
    },
    dueDate: {
      propDefinition: [
        "alegra",
        "dueDate",
      ],
    },
    date: {
      propDefinition: [
        "alegra",
        "date",
      ],
    },
    client: {
      propDefinition: [
        "alegra",
        "client",
      ],
    },
    status: {
      propDefinition: [
        "alegra",
        "statusInvoice",
      ],
      optional: true,
    },
    numberTemplateId: {
      propDefinition: [
        "alegra",
        "numberTemplateId",
      ],
      optional: true,
    },
    numberTemplatePrefix: {
      propDefinition: [
        "alegra",
        "numberTemplatePrefix",
      ],
      optional: true,
    },
    numberTemplateNumber: {
      propDefinition: [
        "alegra",
        "numberTemplateNumber",
      ],
      optional: true,
    },
    payments: {
      propDefinition: [
        "alegra",
        "payments",
      ],
      optional: true,
    },
    estimate: {
      propDefinition: [
        "alegra",
        "estimate",
      ],
      optional: true,
    },
    termsConditions: {
      propDefinition: [
        "alegra",
        "termsConditions",
      ],
      optional: true,
    },
    annotation: {
      propDefinition: [
        "alegra",
        "annotation",
      ],
      optional: true,
    },
    observations: {
      propDefinition: [
        "alegra",
        "observations",
      ],
      optional: true,
    },
    seller: {
      propDefinition: [
        "alegra",
        "sellerInvoice",
      ],
      optional: true,
    },
    pricelist: {
      propDefinition: [
        "alegra",
        "priceListInvoice",
      ],
      optional: true,
    },
    currency: {
      propDefinition: [
        "alegra",
        "currency",
      ],
      optional: true,
    },
    retentions: {
      propDefinition: [
        "alegra",
        "retentions",
      ],
      optional: true,
    },
    warehouse: {
      propDefinition: [
        "alegra",
        "warehouse",
      ],
      optional: true,
    },
    remissions: {
      propDefinition: [
        "alegra",
        "remissions",
      ],
      optional: true,
    },
    costCenter: {
      propDefinition: [
        "alegra",
        "costCenter",
      ],
      optional: true,
    },
    comments: {
      propDefinition: [
        "alegra",
        "comments",
      ],
      optional: true,
    },
    periodicity: {
      propDefinition: [
        "alegra",
        "periodicity",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const invoice = await this.alegra.generateInvoice();
    $.export("$summary", `Created invoice with ID ${invoice.id}`);
    return invoice;
  },
};
