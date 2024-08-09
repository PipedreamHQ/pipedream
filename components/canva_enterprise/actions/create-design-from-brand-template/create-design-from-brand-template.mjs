import canva from "../../canva_enterprise.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "canva_enterprise-create-design-from-brand-template",
  name: "Create Design from Brand Template",
  description: "Creates an asynchronous job to autofill a design from a brand template with your input information. [See the documentation](https://www.canva.dev/docs/connect/api-reference/autofills/create-design-autofill-job/)",
  version: "0.0.1",
  type: "action",
  props: {
    canva,
    brandTemplateId: {
      propDefinition: [
        canva,
        "brandTemplateId",
      ],
      reloadProps: true,
    },
    alert: {
      type: "alert",
      alertType: "error",
      content: "Design not fillable. Design does not have any autofill capable elements.",
      hidden: true,
    },
    title: {
      type: "string",
      label: "Title",
      description: "Title to use for the autofilled design. Must be less than 256 characters. If no design title is provided, the autofilled design will have the same title as the brand template.",
      optional: true,
    },
    waitForCompletion: {
      propDefinition: [
        canva,
        "waitForCompletion",
      ],
    },
  },
  async additionalProps(existingProps) {
    const props = {};
    if (!this.brandTemplateId) {
      return props;
    }
    const { dataset } = await this.canva.getBrandTemplateDataset({
      brandTemplateId: this.brandTemplateId,
    });
    if (!dataset) {
      existingProps.alert.hidden = false;
      return props;
    }
    for (const [
      key,
      value,
    ] of Object.entries(dataset)) {
      props[key] = {
        type: "string",
        label: `${key}`,
        description: value.type === "image"
          ? "The asset ID of an image"
          : "Please enter a text string",
      };
    }
    return props;
  },
  async run({ $ }) {
    const { dataset } = await this.canva.getBrandTemplateDataset({
      $,
      brandTemplateId: this.brandTemplateId,
    });
    if (!dataset) {
      throw new ConfigurationError("Design not fillable. Design does not have any autofill capable elements.");
    }
    for (const [
      key,
      value,
    ] of Object.entries(dataset)) {
      if (value.type === "image") {
        dataset[key].asset_id = this[key];
      } else {
        dataset[key].text = this[key];
      }
    }
    let response = await this.canva.createDesignAutofillJob({
      $,
      data: {
        brand_template_id: this.brandTemplateId,
        data: dataset || {},
        title: this.title,
      },
    });

    if (this.waitForCompletion) {
      const timer = (ms) => new Promise((res) => setTimeout(res, ms));
      const jobId = response.job.id;
      while (response.job.status === "in_progress") {
        response = await this.canva.getDesignAutofillJob({
          $,
          jobId,
        });
        if (response.job.error) {
          throw new Error(response.job.error.message);
        }
        await timer(3000);
      }
    }

    $.export("$summary", `Successfully ${this.waitForCompletion
      ? "created"
      : "started autofil job for"} design`);

    return response;
  },
};
