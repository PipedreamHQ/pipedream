import servicem8 from "../../servicem8.app.mjs";
import { coercePipedreamString } from "../../common/payload.mjs";

export default {
  key: "servicem8-create-job-material",
  name: "Create Job Material",
  description: "Create a job material line. [See the documentation](https://developer.servicem8.com/reference/createjobmaterials)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    servicem8,
    jobUuid: {
      type: "string",
      label: "Job",
      useQuery: true,
      async options({
        $, prevContext, query,
      }) {
        return this.servicem8._uuidOptionsForResource({
          $: $ ?? this,
          resource: "job",
          prevContext,
          query,
        });
      },
      description:
        "The UUID of the job this material is associated with. Required; links the line to its parent job.",
    },
    materialUuid: {
      type: "string",
      label: "Material (catalog)",
      useQuery: true,
      async options({
        $, prevContext, query,
      }) {
        return this.servicem8._uuidOptionsForResource({
          $: $ ?? this,
          resource: "material",
          prevContext,
          query,
        });
      },
      optional: true,
      description:
        "The UUID of the material catalog item this job material is based on.",
    },
    name: {
      type: "string",
      label: "Name",
      optional: true,
      description:
        "Name shown on invoices (max 500 characters). Often from the catalog material; can be customized per job.",
    },
    quantity: {
      type: "string",
      label: "Quantity",
      description:
        "Quantity for this line (required; cannot be empty; max 100 characters).",
    },
    price: {
      type: "string",
      label: "Price",
      optional: true,
      description:
        "Unit price excluding tax. The system may adjust for tax-inclusive pricing consistency.",
    },
    displayedAmount: {
      type: "string",
      label: "Displayed amount",
      description:
        "Unit price as shown on invoices/quotes (required; tax-inclusive or exclusive per “Displayed amount is tax inclusive”).",
    },
    displayedAmountIsTaxInclusive: {
      type: "string",
      label: "Displayed amount is tax inclusive",
      options: [
        {
          label: "Yes",
          value: "true",
        },
        {
          label: "No",
          value: "false",
        },
      ],
      description:
        "Required. UI shows Yes/No; the API receives the strings true or false.",
    },
    taxRateUuid: {
      type: "string",
      label: "Tax rate",
      useQuery: true,
      async options({
        $, prevContext, query,
      }) {
        return this.servicem8._uuidOptionsForResource({
          $: $ ?? this,
          resource: "taxrate",
          prevContext,
          query,
        });
      },
      optional: true,
      description: "The UUID of the tax rate for this line item.",
    },
    sortOrder: {
      type: "string",
      label: "Sort order",
      optional: true,
      description:
        "Display order on the job (lower values first).",
    },
    cost: {
      type: "string",
      label: "Cost",
      optional: true,
      description: "Material cost for this job (ex-tax amount).",
    },
    displayedCost: {
      type: "string",
      label: "Displayed cost",
      description:
        "Cost as displayed (required; inc-tax or ex-tax depending on displayed_amount_is_tax_inclusive).",
    },
    uuid: {
      type: "string",
      label: "Record UUID",
      optional: true,
      description:
        "Optional unique identifier for this record if the API allows you to supply one; otherwise leave blank.",
    },
    jobMaterialBundleUuid: {
      type: "string",
      label: "Job material bundle UUID",
      optional: true,
      description:
        "JobMaterialBundle UUID if this line belongs to a bundle. Leave blank if not part of a bundle.",
    },
  },
  async run({ $ }) {
    const {
      body, recordUuid,
    } = await this.servicem8.createJobMaterial({
      $,
      data: {
        job_uuid: this.jobUuid,
        material_uuid: this.materialUuid,
        name: this.name,
        quantity: this.quantity,
        price: this.price,
        displayed_amount: this.displayedAmount,
        displayed_amount_is_tax_inclusive: coercePipedreamString(
          this.displayedAmountIsTaxInclusive,
        ),
        tax_rate_uuid: this.taxRateUuid,
        sort_order: this.sortOrder,
        cost: this.cost,
        displayed_cost: this.displayedCost,
        uuid: this.uuid,
        job_material_bundle_uuid: this.jobMaterialBundleUuid,
      },
    });
    $.export("$summary", `Created Job Material${recordUuid
      ? ` (${recordUuid})`
      : ""}`);
    return {
      body,
      recordUuid,
    };
  },
};
