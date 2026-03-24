import servicem8 from "../../servicem8.app.mjs";
import { optionalBool01 } from "../../common/payload.mjs";

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
      description: "Job material line to load, merge, and save (search or paste UUID).",
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
      description: "Job this material line belongs to.",
    },
    name: {
      type: "string",
      label: "Name",
      optional: true,
      description: "Line item name shown on the job.",
    },
    description: {
      type: "string",
      label: "Description",
      optional: true,
      description: "Extra detail for this material line.",
    },
    quantity: {
      type: "string",
      label: "Quantity",
      optional: true,
      description: "Quantity sold or used (API string/number as accepted).",
    },
    price: {
      type: "string",
      label: "Price",
      optional: true,
      description: "Sell price per unit or line total per API.",
    },
    sort: {
      type: "string",
      label: "Sort Order",
      optional: true,
      description: "Display order among lines on the job.",
    },
    unitCost: {
      type: "string",
      label: "Unit Cost",
      optional: true,
      description: "Cost/purchase price per unit (distinct from the sell price)",
    },
    active: {
      type: "boolean",
      label: "Active",
      optional: true,
      description: "When set, sends 1 (active) or 0 (inactive) to the API",
    },
  },
  async run({ $ }) {
    const response = await this.servicem8.updateJobMaterial({
      $,
      uuid: this.uuid,
      data: {
        job_uuid: this.jobUuid,
        name: this.name,
        description: this.description,
        quantity: this.quantity,
        price: this.price,
        sort: this.sort,
        unit_cost: this.unitCost,
        active: optionalBool01(this.active),
      },
    });
    $.export("$summary", `Updated Job Material ${this.uuid}`);
    return response;
  },
};
