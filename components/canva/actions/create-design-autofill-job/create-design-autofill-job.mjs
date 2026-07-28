// x-pd-ai: optimized
import { ConfigurationError } from "@pipedream/platform";
import canva from "../../canva.app.mjs";
import constants from "../../common/constants.mjs";

const POLL_INTERVAL_MS = 3000;
const MAX_POLL_ATTEMPTS = 40; // ~2 minutes at 3s intervals

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
      description: "The ID of the brand template to autofill (e.g. `DEMzWSwy3BI`). Discover IDs via **List Brand Templates**. Required when type is `create_from_brand_template`.",
      optional: true,
    },
    designId: {
      propDefinition: [
        canva,
        "designId",
      ],
      description: "The ID of the source design to autofill from. Required when type is `create_from_design`.",
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

    if (this.type === "create_from_brand_template" && !this.brandTemplateId) {
      throw new ConfigurationError("Brand Template ID is required when Type is `create_from_brand_template`.");
    }
    if (this.type === "create_from_design" && !this.designId) {
      throw new ConfigurationError("Design ID is required when Type is `create_from_design`.");
    }

    const requestData = {
      type: this.type,
      data,
    };
    if (this.type === "create_from_brand_template") {
      requestData.brand_template_id = this.brandTemplateId;
    } else if (this.type === "create_from_design") {
      requestData.design_id = this.designId;
    }

    let response = await this.canva.createAutofillJob({
      $,
      data: requestData,
    });

    if (this.waitForCompletion) {
      const timer = (ms) => new Promise((res) => setTimeout(res, ms));
      const jobId = response.job?.id;
      let attempts = 0;
      while (response.job?.status === constants.JOB_STATUS.IN_PROGRESS) {
        if (attempts >= MAX_POLL_ATTEMPTS) {
          throw new Error(`Autofill job "${jobId}" did not complete after ~${(MAX_POLL_ATTEMPTS * POLL_INTERVAL_MS) / 1000}s.`);
        }
        attempts += 1;
        await timer(POLL_INTERVAL_MS);
        response = await this.canva.getAutofillJob({
          $,
          jobId,
        });
        if (response.job?.status === constants.JOB_STATUS.FAILED) {
          throw new Error(response.job?.error?.message ?? "Autofill job failed");
        }
      }
    }

    $.export("$summary", `Successfully ${this.waitForCompletion
      ? "completed"
      : "started"} autofill job "${response.job?.id}"`);
    return response;
  },
};
