import servicem8 from "../../servicem8.app.mjs";
import { YES_NO_TRUE_FALSE_OPTIONS } from "../../common/logic.mjs";
import { coercePipedreamString } from "../../common/payload.mjs";

export default {
  key: "servicem8-update-job-material",
  name: "Update Job Material",
  description: "Update a job material line (loads the record, merges your fields, then POSTs). [See the documentation](https://developer.servicem8.com/reference/updatejobmaterials)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    servicem8,
    uuid: {
      type: "string",
      useQuery: true,
      async options({
        $, prevContext, query,
      }) {
        return this.servicem8._uuidOptionsForResource({
          $: $ ?? this,
          resource: "jobmaterial",
          prevContext,
          query,
        });
      },
      label: "Job material to update",
      description:
        "Unique identifier for this job material record — the line to load, merge, and save (search or paste UUID).",
    },
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
      optional: true,
      description:
        "The UUID of the job this material is associated with. Establishes the relationship between the job material and its parent job.",
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
        "The name of the material on the job (shown on invoices; max 500 characters). Can differ from the catalog material name.",
    },
    quantity: {
      type: "string",
      label: "Quantity",
      description:
        "The quantity of this material used on the job (required; cannot be empty; max 100 characters).",
    },
    price: {
      type: "string",
      label: "Price",
      optional: true,
      description:
        "Unit price excluding tax. The system may adjust this for tax-inclusive pricing consistency.",
    },
    displayedAmount: {
      type: "string",
      label: "Displayed amount",
      description:
        "Unit price as shown on invoices and quotes (required; tax-inclusive or exclusive per “Displayed amount is tax inclusive”).",
    },
    displayedAmountIsTaxInclusive: {
      type: "string",
      label: "Displayed amount is tax inclusive",
      options: YES_NO_TRUE_FALSE_OPTIONS,
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
        "Display order of materials on the job (lower values first).",
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
    jobMaterialBundleUuid: {
      type: "string",
      label: "Job material bundle UUID",
      optional: true,
      description:
        "UUID of a JobMaterialBundle this line belongs to. Leave blank if not part of a bundle.",
    },
  },
  async run({ $ }) {
    const response = await this.servicem8.updateJobMaterial({
      $,
      uuid: this.uuid,
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
        job_material_bundle_uuid: this.jobMaterialBundleUuid,
      },
    });
    $.export("$summary", `Updated Job Material ${this.uuid}`);
    return response;
  },
};
