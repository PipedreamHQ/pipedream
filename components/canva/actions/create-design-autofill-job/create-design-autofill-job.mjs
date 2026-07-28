// x-pd-ai: optimized
import canva from "../../canva.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "canva-create-design-autofill-job",
  name: "Create Design Autofill Job",
  description: "Start an autofill job via POST /autofills to generate a design from a brand template (or another design) using a data payload. Use **Get Brand Template Dataset** to learn valid field names/types, then poll status with **Get Design Autofill Job**. [See the documentation](https://www.canva.dev/docs/connect/api-reference/autofills/create-design-autofill-job/).",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    canva,
    type: {
      type: "string",
      label: "Type",
      description: "Autofill source type. Valid values: `create_from_brand_template`, `create_from_design`.",
      options: constants.AUTOFILL_TYPE_OPTIONS,
    },
    brandTemplateId: {
      propDefinition: [
        canva,
        "brandTemplateId",
      ],
      description: "The ID of the brand template to autofill (e.g. `BT1234abcd`). Discover IDs via **List Brand Templates**. Required when type is `create_from_brand_template`.",
      optional: true,
    },
    data: {
      type: "string",
      label: "Data",
      description: "JSON object of DatasetValues keyed by field name; each value has a `type` and type-specific fields. Example: `{\"headline\":{\"type\":\"text\",\"text\":\"Hello World\"}}`. Use **Get Brand Template Dataset** to discover valid field names.",
    },
    waitForCompletion: {
      propDefinition: [
        canva,
        "waitForCompletion",
      ],
    },
  },
  async run({ $ }) {
    const data = JSON.parse(this.data);

    let response = await this.canva.createAutofillJob({
      $,
      data: {
        type: this.type,
        brand_template_id: this.brandTemplateId,
        data,
      },
    });

    if (this.waitForCompletion) {
      const timer = (ms) => new Promise((res) => setTimeout(res, ms));
      const jobId = response.job?.id;
      while (response.job?.status?.state === constants.JOB_STATUS.IN_PROGRESS) {
        await timer(3000);
        response = await this.canva.getAutofillJob({
          $,
          jobId,
        });
        if (response.job?.status?.state === constants.JOB_STATUS.FAILED) {
          throw new Error(response.job.status.error?.message ?? "Autofill job failed");
        }
      }
    }

    $.export("$summary", `Successfully ${this.waitForCompletion
      ? "completed"
      : "started"} autofill job "${response.job?.id}"`);
    return response;
  },
};
